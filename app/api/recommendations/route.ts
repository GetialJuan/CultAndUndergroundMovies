import { NextRequest, NextResponse } from 'next/server';
import { getUserRecommendations, markRecommendationAsViewed } from '@/lib/services/recommendations';
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/recommendations - Get recommendations for the current user
export async function GET(request: NextRequest) {
  const session: any = await getServerSession(authOptions as any);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const recommendations = await getUserRecommendations(session.user.id);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

// POST /api/recommendations/viewed - Mark a recommendation as viewed
export async function POST(request: NextRequest) {
  const session: any = await getServerSession(authOptions as any);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { movieId } = await request.json();
    
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }
    
    await markRecommendationAsViewed(session.user.id, movieId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking recommendation as viewed:', error);
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 });
  }
}
