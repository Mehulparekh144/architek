import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";

// Define the model configuration interface
interface ModelConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  [key: string]: any; // For any additional parameters
}

// Define the message interface
interface Message {
  role: string;
  content: string;
}

/**
 * Creates a streaming chain using the provided model configuration
 * @param modelConfig - Configuration for the language model
 * @returns A configured LangChain for streaming
 */
function createStreamingChain(modelConfig: ModelConfig) {
  // Initialize the LLM with streaming capability
  const llm = new ChatOpenAI({
    modelName: modelConfig.model,
    temperature: modelConfig.temperature ?? 0.7,
    maxTokens: modelConfig.maxTokens ?? 1000,
    streaming: true, // Enable streaming
    ...Object.fromEntries(
      Object.entries(modelConfig).filter(
        ([key]) => !["model", "temperature", "maxTokens", "systemPrompt"].includes(key)
      )
    ),
  });

  // Create a basic chat prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", modelConfig.systemPrompt ?? "You are a helpful assistant."],
    ["human", "{input}"]
  ]);

  // Create the chain
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  return chain;
}

/**
 * Generate a streaming response for a list of messages
 * @param chain - The LangChain chain created with createStreamingChain
 * @param messagesList - List of message objects with 'role' and 'content'
 * @returns An async generator that yields chunks of the response
 */
async function* generateStreamingResponse(chain: any, messagesList: Message[]) {
  // Format messages into a single input string
  const formattedInput = messagesList
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n");

  // Stream the response
  for await (const chunk of await chain.stream({ input: formattedInput })) {
    yield chunk;
  }
}

/**
 * Creates an advanced streaming chain that properly handles message roles
 * @param modelConfig - Configuration for the language model
 * @returns A configured ChatOpenAI instance for streaming
 */
function createAdvancedStreamingChain(modelConfig: ModelConfig) {
  // Initialize the LLM with streaming capability
  const llm = new ChatOpenAI({
    modelName: modelConfig.model,
    temperature: modelConfig.temperature ?? 0.7,
    maxTokens: modelConfig.maxTokens ?? 1000,
    streaming: true,
    ...Object.fromEntries(
      Object.entries(modelConfig).filter(
        ([key]) => !["model", "temperature", "maxTokens", "systemPrompt"].includes(key)
      )
    ),
  });

  return llm;
}

/**
 * Converts messages from dictionary format to LangChain message objects
 * @param messagesList - List of message objects with 'role' and 'content'
 * @returns Array of LangChain message objects
 */
function convertMessageFormat(messagesList: Message[]): BaseMessage[] {
  const langchainMessages: BaseMessage[] = [];

  for (const msg of messagesList) {
    const role = msg.role.toLowerCase();
    const content = msg.content;

    if (role === "system") {
      langchainMessages.push(new SystemMessage(content));
    } else if (role === "user") {
      langchainMessages.push(new HumanMessage(content));
    } else if (role === "assistant") {
      langchainMessages.push(new AIMessage(content));
    }
  }

  return langchainMessages;
}

/**
 * Generate a streaming response with proper message role handling
 * @param llm - The ChatOpenAI instance created with createAdvancedStreamingChain
 * @param messagesList - List of message objects with 'role' and 'content'
 * @returns An async generator that yields chunks of the response
 */
async function* generateAdvancedStreamingResponse(llm: ChatOpenAI, messagesList: Message[]) {
  // Convert messages to LangChain format
  const langchainMessages = convertMessageFormat(messagesList);

  // Stream the response
  for await (const chunk of await llm.stream(langchainMessages)) {
    if (chunk.content) {
      yield chunk.content;
    } else {
      yield String(chunk);
    }
  }
}

// Example usage with Express for a web API
// This is a simple implementation - you would need to install express and body-parser
/*
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const modelConfig = req.body.modelConfig || {};
  const messages = req.body.messages || [];
  
  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  try {
    // Create LLM chain
    const llm = createAdvancedStreamingChain(modelConfig);
    
    // Stream the response
    for await (const chunk of generateAdvancedStreamingResponse(llm, messages)) {
      res.write(`data: ${chunk}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during processing' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// Example of using in a Node.js script
async function example() {
  // Model configuration
  const modelConfig: ModelConfig = {
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    maxTokens: 500,
    systemPrompt: "You are a helpful assistant that provides concise answers."
  };

  // Sample messages with proper roles
  const messages: Message[] = [
    { role: "system", content: "You are a helpful assistant that provides concise answers." },
    { role: "user", content: "What are the benefits of exercise?" }
  ];

  // Create the LLM
  const llm = createAdvancedStreamingChain(modelConfig);

  // Generate and print streaming response
  for await (const chunk of generateAdvancedStreamingResponse(llm, messages)) {
    process.stdout.write(chunk);
  }
  process.stdout.write('\n');
}

// Run the example (uncomment to execute)
// example().catch(console.error);

export {
  createStreamingChain,
  generateStreamingResponse,
  createAdvancedStreamingChain,
  convertMessageFormat,
  generateAdvancedStreamingResponse
};