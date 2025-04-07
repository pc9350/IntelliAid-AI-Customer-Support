import { parse } from 'cookie';

// Helper function to get a valid base URL for API calls
const getBaseUrl = (req) => {
  // First try the environment variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Then try the request origin
  if (req.headers && req.headers.origin) {
    return req.headers.origin;
  }
  
  // Fallback to localhost if in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Absolute fallback
  return '';
};

// This is a router API that will forward the request to either OpenAI or AWS Bedrock
// based on the user's preference stored in a cookie
export default async function handler(req, res) {
  try {
    // Parse cookies to check for model preference
    const cookies = parse(req.headers.cookie || '');
    const isUsingBedrock = cookies.modelPreference === 'bedrock';
    
    // Forward the request to the appropriate API handler
    const targetEndpoint = isUsingBedrock ? '/api/chatAWS' : '/api/chatOpenAI';
    
    // Forward the request to the correct endpoint
    const baseUrl = getBaseUrl(req);
    const response = await fetch(`${baseUrl}${targetEndpoint}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''  // Forward cookies to maintain conversation history
      },
      body: JSON.stringify(req.body)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from ${targetEndpoint}: ${response.status} ${response.statusText}`, errorText);
      return res.status(response.status).json({ 
        error: `Error from AI provider`, 
        details: errorText,
        provider: isUsingBedrock ? 'AWS Bedrock' : 'OpenAI'
      });
    }

    // Check if we need to stream the response (OpenAI)
    if (!isUsingBedrock) {
      // OpenAI's chatOpenAI handler uses streaming, so we need to stream the response
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      });

      // Stream the response back to the client
      if (response.body) {
        const reader = response.body.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      
      res.end();
    } else {
      // For AWS Bedrock, it's a regular JSON response
      try {
        const contentType = response.headers.get('Content-Type') || '';
        const data = await response.text();
        
        // Set the appropriate content type header for the response
        if (contentType) {
          res.setHeader('Content-Type', contentType);
        }
        
        // Forward the response status and data
        res.status(response.status).send(data);
      } catch (error) {
        console.error('Error processing AWS Bedrock response:', error);
        res.status(500).json({ 
          error: 'Error processing AI response', 
          details: error.message,
          provider: 'AWS Bedrock'
        });
      }
    }
  } catch (error) {
    console.error('Chat Router Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message,
      trace: error.stack
    });
  }
}

// import OpenAI from "openai";

// const systemPrompt = `You are a customer support chatbot for TrendyThreads, a leading fast-fashion retail company known for its stylish and affordable clothing, accessories, and footwear. Your role is to assist customers with their inquiries in a friendly, professional, and efficient manner. You should be knowledgeable about our products, services, policies, and promotions. Always aim to provide clear, concise, and helpful responses.

// Greeting and Introduction:

// Begin every conversation with a warm greeting and introduce yourself.

// Product Information:

// Provide detailed information about products, including sizes, colors, materials, and availability.
// Example: "Our summer collection includes a variety of floral dresses available in sizes XS to XL. Would you like to know more about a specific item?"
// Order Assistance:

// Help customers with order placements, tracking, and updates.
// Example: "To track your order, please provide your order number. You can find this in your confirmation email."
// Returns and Exchanges:

// Explain the returns and exchange policy and guide customers through the process.
// Example: "You can return any item within 30 days of purchase. Would you like assistance with starting a return or exchange?"
// Promotions and Discounts:

// Inform customers about current promotions, discounts, and how to apply them.
// Example: "We are currently offering a 20% discount on all items for new customers. Use code NEW20 at checkout."
// Store Locations and Hours:

// Provide information about store locations, hours of operation, and in-store services.
// Example: "Our New York store is open from 10 AM to 9 PM, Monday to Saturday. Would you like the address?"
// Technical Support:

// Assist customers with technical issues related to the website or mobile app.
// Example: "If you are experiencing issues with the website, please try clearing your browser cache and cookies. If the problem persists, I can guide you further."
// General Inquiries:

// Address any other questions or concerns customers may have.
// Example: "How can I help you with your fashion needs today?"
// Closing and Follow-Up:

// End conversations politely and offer additional help if needed.
// Example: "Thank you for contacting TrendyThreads. Have a great day! If you need further assistance, feel free to reach out."
// Remember to be patient, empathetic, and positive in all interactions. Strive to make every customer feel valued and satisfied with their experience.`

// const handler = async (req, res) => {
  
//     const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
  
//     try {
//       // Use the already parsed request body
//       const data = req.body;
  
//       const completion = await openai.chat.completions.create({
//         messages: [{ role: 'system', content: systemPrompt }, ...data],
//         model: 'gpt-3.5-turbo',
//         stream: true,
//       });
  

  
//       res.writeHead(200, {
//         'Content-Type': 'text/plain; charset=utf-8',
//         'Transfer-Encoding': 'chunked',
//       });
  
//       const encoder = new TextEncoder();
  
//       for await (const chunk of completion) {
//         const content = chunk.choices[0]?.delta?.content;
//         if (content) {
//           const text = encoder.encode(content);
//           res.write(text);
//         }
//       }

//       res.end();
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
  
//   export default handler;