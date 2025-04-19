import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    // Llama al webhook de n8n
    const n8nRes = await fetch(
      'http://localhost:5678/webhook/chat-cultmovies',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      }
    );

    if (!n8nRes.ok) {
      return NextResponse.json({ error: 'Error from n8n' }, { status: 500 });
    }

    const n8nData = await n8nRes.json();
    return NextResponse.json({ answer: n8nData.output });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
