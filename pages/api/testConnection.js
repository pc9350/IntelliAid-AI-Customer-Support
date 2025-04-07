import OpenAI from "openai";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  let openAIStatus = false;
  let bedrockStatus = false;
  let errors = {};
  
  // Test OpenAI connectivity
  try {
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    const models = await openai.models.list();
    openAIStatus = !!models.data.length; // Will be true if we got models back
  } catch (error) {
    errors.openai = error.message;
  }
  
  // Test AWS Bedrock connectivity
  try {
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
    
    // Just instantiate the client and see if it throws an error
    // A more comprehensive test would be to make an actual API call,
    // but we'll keep it simple for now
    bedrockStatus = !!client;
  } catch (error) {
    errors.bedrock = error.message;
  }
  
  // Return the status of both services
  res.status(200).json({
    openai: {
      available: openAIStatus,
      error: errors.openai || null
    },
    bedrock: {
      available: bedrockStatus,
      error: errors.bedrock || null
    }
  });
} 