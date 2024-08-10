import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { parse } from 'cookie';


const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

const systemPrompt = `You are a customer support chatbot named OuiOui for TrendyThreads, a leading fast-fashion retail company. Your role is to assist customers with their inquiries in a friendly, professional, and efficient manner. You should be knowledgeable about our products, services, policies, and promotions. Always aim to provide clear, concise, and helpful responses.

Important guidelines:
1. Start the conversation with a warm greeting and introduce yourself.
2. After the initial greeting, avoid repeating the introduction or greeting in subsequent responses.
3. Focus on providing helpful, direct answers to the customer's questions, and ask for clarification only if necessary.
4. If the user asks for information about a product or service, provide that information directly without unnecessary preambles.
5. Be conversational and adjust your tone to match the user’s query. Be concise when possible, but thorough in answering the question.
6. Offer further assistance or ask if the user needs help with anything else, but avoid repeating the same phrases in every response.

Example Flow:
- User: Hi
- Response: Hello there! I'm Claude, your support assistant for TrendyThreads. How can I help you today?

- User: I need help with a product
- Response: Sure! What kind of product are you interested in? I can help you find clothing, accessories, or anything else from our collection.

- User: I am looking for a shirt
- Response: Great choice! We have a variety of shirts. Are you looking for something casual or formal?

Now, go ahead and assist the customer while following these guidelines.`

const handler = async (req, res) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    const hasIntroduced = cookies.hasIntroduced === 'true';

    // console.log("AWS Bedrock Request body:", req.body);
    const data = req.body; // This should contain the user message and other inputs

    // Check if it's the first interaction
    if (!data || data.length === 0 || data[0].role !== 'user') {
      return res.status(400).json({ error: "The first message must be from the user." });
    }

    const conversation = [
      { role: 'user', content: `${systemPrompt}\n\n${data[0].content}` }
    ];

    // let conversation;
    
    // if (!hasIntroduced) {
    //   // Add the system prompt to the conversation with an introduction
    //   conversation = [
    //     { role: 'user', content: `${systemPrompt}\n\n${data[0].content}` }
    //   ];
    //   // Set the hasIntroduced cookie
    //   res.setHeader('Set-Cookie', `hasIntroduced=true; Path=/`);
    // } else {
    //   // Only use the user's message without repeating the introduction
    //   conversation = [
    //     { role: 'user', content: `${data[0].content}` }
    //   ];
    // }


    const params = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: conversation,
      }),
      contentType: "application/json",
      accept: "application/json",
    };

    const command = new InvokeModelCommand(params);
    const response = await client.send(command);

    const responseBodyString = Buffer.from(response.body).toString('utf-8');
    // console.log("AWS Bedrock Response body (string):", responseBodyString);

    // Parse the string as JSON
    const responseBody = JSON.parse(responseBodyString);
    // console.log("Parsed AWS Bedrock Response body:", responseBody);

     // Check if messages property exists and extract the assistant's message content
     let assistantMessage = "No response from assistant.";
    if (responseBody.content && responseBody.content.length > 0) {
      assistantMessage = responseBody.content.map(item => item.text).join(" ");
    }

    res.status(200).send( assistantMessage );
  } catch (error) {
    console.error("AWS Bedrock Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
