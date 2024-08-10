import boto3
from botocore.exceptions import ClientError

# Create a Bedrock Runtime client in the AWS Region you want to use.
client = boto3.client("bedrock-runtime", region_name="us-east-1")

# Set the model ID, e.g., Titan Text Premier.
model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

# Define the initial system prompt for the chatbot.
initial_prompt = """
You are a customer support chatbot name OuiOui for TrendyThreads, a leading fast-fashion retail company known for its stylish and affordable clothing, accessories, and footwear. Your role is to assist customers with their inquiries in a friendly, professional, and efficient manner. You should be knowledgeable about our products, services, policies, and promotions. Always aim to provide clear, concise, and helpful responses.

Greeting and Introduction:
Begin every conversation with a warm greeting and introduce yourself.
"""

# Define the ongoing system prompt after the introduction.
ongoing_prompt = """
You are a customer support chatbot for TrendyThreads. Assist the customer without repeating your introduction. Focus on the customer's questions and provide helpful, concise answers.
"""

# Function to generate user message based on whether the introduction has been done.
def generate_user_message(has_introduced):
    if not has_introduced:
        return f"""{initial_prompt}

Here is the first question: What is the return policy at TrendyThreads?

If you need to reference specific information, you can pull details from the following system information:

<document>
{initial_prompt}
</document>

Now, based on the system information provided, please answer the first question in the following format:

- First, greet the customer and introduce yourself.
- Next, state the return policy of TrendyThreads as per the provided information.
- Conclude with an offer for further assistance.

If the question cannot be answered by the document, say so.

Answer the question immediately without preamble."""
    else:
        return f"""{ongoing_prompt}

Here is the next question: What is the return policy at TrendyThreads?

If you need to reference specific information, you can pull details from the following system information:

<document>
{ongoing_prompt}
</document>

Now, based on the system information provided, please answer the question in the following format:

- State the return policy of TrendyThreads as per the provided information.
- Conclude with an offer for further assistance.

If the question cannot be answered by the document, say so.

Answer the question immediately without preamble."""

# Example of how to use the function
has_introduced = False  # This should be dynamically set based on the state
user_message = generate_user_message(has_introduced)

conversation = [
    {
        "role": "user",
        "content": [{"text": user_message}],
    }
]

try:
    # Send the message to the model, using the correct inference configuration.
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": conversation
        }),
        contentType="application/json",
        accept="application/json",
    )

    # Extract and print the response text.
    response_body = json.loads(response["body"].read().decode())
    print("Response Body:", response_body)

    # Extract the assistant's message content
    if 'content' in response_body:
        assistant_message = response_body['content']
        print("Assistant's response:", assistant_message)
    else:
        print("No content in the response.")

except (ClientError, Exception) as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    exit(1)

# try:
#     # Send the message to the model, using a basic inference configuration.
#     response = client.converse(
#         modelId="anthropic.claude-3-sonnet-20240229-v1:0",
#         messages=conversation,
#         inferenceConfig={"maxTokens":2000,"temperature":0},
#         additionalModelRequestFields={"top_k":250}
#     )

#     # Extract and print the response text.
#     response_text = response["output"]["message"]["content"][0]["text"]
#     print(response_text)

# except (ClientError, Exception) as e:
#     print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
#     exit(1)
