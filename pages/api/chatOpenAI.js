import OpenAI from "openai";
import { parse, serialize } from "cookie";

const systemPrompt = `You are a customer support chatbot called OuiOui for TrendyThreads, a leading fast-fashion retail company known for its stylish and affordable clothing, accessories, and footwear. Your role is to assist customers with their inquiries in a friendly, professional, and efficient manner. You are knowledgeable about our products, services, policies, and promotions.

## Specific Capabilities
1. Product Information: You can provide details about TrendyThreads products.
2. Order Tracking: You can help customers track their orders using order numbers (format: TT-2023-XXXXX).
3. Return & Exchange Policies: You can explain our return and exchange procedures.
4. Store Locations and Hours: You can provide information about our physical store locations.
5. Shipping Information: You can explain shipping options, costs and timeframes.
6. Account assistance: You can help users with login issues or account-related questions.

## Response Guidelines
- Be friendly, professional, and personable in your responses.
- If a user asks about specific product information, orders, or other data that might require retrieving information from our database, ALWAYS check if the provided information is valid before giving specific details.
- For order tracking, explain that you need a valid order number in the format TT-2023-XXXXX.
- For products, you can recommend items from our current catalog if the customer is looking for suggestions.
- If you don't know the answer or need more information, politely ask for clarification.
- Keep responses concise while being helpful and thorough.

## Sample Dialog Patterns
Customer: "I'd like to know about women's dresses"
You: "I'd be happy to help you with information about our women's dresses! We have a variety of styles including summer dresses, formal dresses, and casual options. Most come in sizes XS through XL and prices range from $29.99 to $89.99. Would you like me to recommend some specific dresses from our current collection?"

Customer: "Where's my order?"
You: "I'd be happy to help you track your order. Could you please provide your order number? It should be in the format TT-2023-XXXXX and can be found in your order confirmation email."

Customer: "My order number is TT-2023-10015"
You: "Thank you for providing your order number. Let me check the status for you..." [Then provide order details based on the data provided by our API]

Remember to be patient, empathetic, and positive in all interactions. Strive to make every customer feel valued and satisfied with their experience.`;

// Maximum number of messages to keep in the conversation history
const MAX_CONVERSATION_HISTORY = 10;

const chatOpenAI = async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

  try {
    const data = req.body;
    const cookies = parse(req.headers.cookie || '');
    
    // Get conversation history from cookie or initialize new one
    let conversationHistory = [];
    if (cookies.conversationHistory) {
      try {
        conversationHistory = JSON.parse(decodeURIComponent(cookies.conversationHistory));
      } catch (e) {
        console.error('Error parsing conversation history:', e);
      }
    }

    // Add the new message to the history
    if (data && data.length > 0) {
      conversationHistory.push(data[0]);
    }

    // Check if this message might be asking about products or order tracking
    // so we can enrich the prompt with actual data
    const latestMessage = data && data.length > 0 ? data[0].content.toLowerCase() : '';
    let additionalContextMessage = null;
    
    // Check for product-related queries
    if (latestMessage.includes('product') || 
        latestMessage.includes('dress') || 
        latestMessage.includes('shirt') || 
        latestMessage.includes('jeans') ||
        latestMessage.includes('jacket') ||
        latestMessage.includes('sweater') ||
        latestMessage.includes('legging') ||
        latestMessage.includes('sale') ||
        latestMessage.includes('new arrival')) {
          
      try {
        // Fetch product data
        const productResponse = await fetch(`${req.headers.origin}/api/productCatalog?type=featured`);
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          
          // Create a message with product information
          additionalContextMessage = {
            role: 'system',
            content: `Here's some of our featured products that might be relevant to the customer's inquiry:\n${JSON.stringify(productData, null, 2)}\n\nPlease use this information if relevant to the customer's question. Don't provide the entire list unprompted, but use it to give accurate information about specific products if asked.`
          };
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }
    
    // Check for order tracking queries
    const orderIdRegex = /TT-2023-\d{5}/i;
    const orderIdMatch = latestMessage.match(orderIdRegex);
    
    if (latestMessage.includes('order') || 
        latestMessage.includes('tracking') || 
        latestMessage.includes('delivery') ||
        latestMessage.includes('shipment') ||
        latestMessage.includes('shipped') ||
        orderIdMatch) {
          
      try {
        // If we have an order ID in the message, fetch that specific order
        if (orderIdMatch) {
          const orderResponse = await fetch(`${req.headers.origin}/api/orderTracking?orderId=${orderIdMatch[0]}`);
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            
            // Create a message with order information
            additionalContextMessage = {
              role: 'system',
              content: `The customer has provided order number ${orderIdMatch[0]}. Here is the order information:\n${JSON.stringify(orderData, null, 2)}\n\nPlease provide a helpful summary of this order information to the customer, including the order status, estimated delivery date, and tracking information if available.`
            };
          } else if (orderResponse.status === 404) {
            // Order not found
            additionalContextMessage = {
              role: 'system',
              content: `The customer provided order number ${orderIdMatch[0]}, but this order was not found in our system. Suggest they check the order number and try again, or provide alternative ways to look up their order (like using their email address).`
            };
          }
        } else {
          // Just a general order query, provide example order numbers they could use
          const ordersResponse = await fetch(`${req.headers.origin}/api/orderTracking`);
          
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            
            if (ordersData.orders && ordersData.orders.length > 0) {
              // Create a message with sample order information
              additionalContextMessage = {
                role: 'system',
                content: `The customer is asking about orders or tracking. Here are some sample order numbers they could use: ${ordersData.orders.slice(0, 3).map(order => order.id).join(', ')}. Guide them to provide one of these order numbers to get detailed tracking information.`
              };
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    }

    // Add store policy information for related queries
    if (latestMessage.includes('return') || 
        latestMessage.includes('exchange') || 
        latestMessage.includes('refund') ||
        latestMessage.includes('shipping') ||
        latestMessage.includes('delivery') ||
        latestMessage.includes('policy')) {
          
      try {
        const policiesResponse = await fetch(`${req.headers.origin}/api/productCatalog?type=policies`);
        
        if (policiesResponse.ok) {
          const policiesData = await policiesResponse.json();
          
          // Create a message with policy information
          additionalContextMessage = {
            role: 'system',
            content: `The customer is asking about our policies. Here is our policy information:\n${JSON.stringify(policiesData, null, 2)}\n\nPlease provide a clear explanation of the relevant policy based on the customer's question.`
          };
        }
      } catch (error) {
        console.error('Error fetching policy data:', error);
      }
    }
    
    // Add store location information for related queries
    if (latestMessage.includes('store') || 
        latestMessage.includes('location') || 
        latestMessage.includes('address') ||
        latestMessage.includes('hour') ||
        latestMessage.includes('open')) {
          
      try {
        const locationsResponse = await fetch(`${req.headers.origin}/api/productCatalog?type=locations`);
        
        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json();
          
          // Create a message with store location information
          additionalContextMessage = {
            role: 'system',
            content: `The customer is asking about our store locations. Here is our store information:\n${JSON.stringify(locationsData, null, 2)}\n\nPlease provide helpful information about our stores based on the customer's question.`
          };
        }
      } catch (error) {
        console.error('Error fetching store location data:', error);
      }
    }

    // Limit the history size to prevent oversized cookies
    if (conversationHistory.length > MAX_CONVERSATION_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_CONVERSATION_HISTORY);
    }

    // Create the messages array for OpenAI API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory
    ];
    
    // Add the additional context message if available
    if (additionalContextMessage) {
      messages.splice(1, 0, additionalContextMessage); // Insert after system prompt but before conversation
    }

    // Set up streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    });

    const encoder = new TextEncoder();
    
    // Call the OpenAI API with streaming
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
      stream: true,
    });

    // Collect the assistant's response to add to history
    let assistantResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        assistantResponse += content;
        const text = encoder.encode(content);
        res.write(text);
      }
    }

    // Add the assistant's response to conversation history
    conversationHistory.push({ role: 'assistant', content: assistantResponse });
    
    // Update the conversation history cookie
    const serializedHistory = serialize(
      'conversationHistory',
      encodeURIComponent(JSON.stringify(conversationHistory)),
      {
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      }
    );
    
    res.setHeader('Set-Cookie', serializedHistory);
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default chatOpenAI;
