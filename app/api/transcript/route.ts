import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { AzureOpenAI } from "openai";
import { NextRequest } from "next/server";
import { createReadStream } from "fs";

const getClient = () => {
    return new AzureOpenAI({
        endpoint: process.env.AZURE_ENDPOINT || "",
        apiKey: process.env.AZURE_API_KEY || "",
        apiVersion: process.env.AZURE_API_VERSION || "",
        deployment: process.env.AZURE_DEPLOYMENT_NAME || "",
    });
};

export async function POST(request: NextRequest) {
    try {
        // Get the form data from the request
        const formData = await request.formData();
        const audioFile = formData.get('file');
        
        if (!audioFile || !(audioFile instanceof File)) {
            return new Response(JSON.stringify({ error: 'No audio file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Convert the file to a Buffer
        const arrayBuffer = await audioFile.arrayBuffer();

        // Convert the ArrayBuffer to a Buffer
        const audioBuffer = Buffer.from(arrayBuffer);
        
        const client = getClient();
        
        // Call the OpenAI API to transcribe the audio
        const result = await client.audio.transcriptions.create({
            model: "", // Use the appropriate model name for Azure
            file: new File([audioBuffer], audioFile.name, { type: audioFile.type }),
        });
        
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Transcription error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to transcribe audio' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}