// backend/controllers/chatbotController.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { preprocessText, isUniversityRelated } from '../utils/nlpProcessor.js';
import dotenv from 'dotenv';
dotenv.config();

// Gemini system prompt
const SYSTEM_PROMPT = `
You are a helpful AI assistant for a university event management system. You should only respond to queries related to university events, activities, student life, academic events, clubs, workshops, seminars, conferences, hackathons, cultural events, sports events, competitions, volunteering opportunities, academic initiatives, and similar topics.

If a query is out of scope or unrelated to university events or activities, please suggest something relevant and helpful for students, such as upcoming university events, workshops, or initiatives, or guide them to resources they might find useful for university life.

For queries that do not fit into the university-related categories, respond with: "I'm sorry, but I can only help with university-related queries. However, here's something you might be interested in: [suggestion related to student life, events, or activities and mention our website GEM-ARC where anyone can see varieties of events and can participate to it]."

Your goal is to help students and faculty plan and organize university events, provide suggestions for event ideas, and answer questions about event planning and management. Be professional, concise, and helpful. Avoid recommending or suggesting any inappropriate activities that would not be suitable for a university setting.

`;

// Create an instance of GoogleGenerativeAI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Model setup
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Update this based on available models
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Process chatbot query
export const processQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        message: "No query provided" 
      });
    }

    console.log(`Received query: ${query}`);

    // Preprocess the query
    const queryKeywords = preprocessText(query);
    console.log(`Extracted keywords: ${queryKeywords.join(', ')}`);

    // Check if query is university-related
    if (isUniversityRelated(queryKeywords)) {
      console.log('Query is university-related. Proceeding to Gemini.');

      // Call Gemini API to get a response
      try {
        const response = await getGeminiResponse(query);
        return res.json({ 
          response, 
          approved: true 
        });
      } catch (geminiError) {
        console.error('Error with Gemini API:', geminiError);
        // Fallback response if Gemini API fails
        return res.json({
          response: "I'm sorry, I'm having trouble generating a response right now. Please try again later.",
          approved: true
        });
      }
    } else {
      console.log('Query is not university-related. Rejecting.');
      return res.json({
        response: "I'm sorry, but I can only help with university-related queries.",
        approved: false
      });
    }
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    return res.status(500).json({ 
      message: "An error occurred while processing your query",
      error: error.message 
    });
  }
};

// Call Gemini API using GoogleGenerativeAI library
const getGeminiResponse = async (query) => {
  try {
    // Combine the system prompt with user query
    const combinedPrompt = `${SYSTEM_PROMPT}\n\nUser query: ${query}`;

    // Start a new chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the prompt to the model
    const result = await chatSession.sendMessage(combinedPrompt);

    // Log and return the response
    console.log('Received response from Gemini');
    return result.response.text(); // Get the text from the response

  } catch (error) {
    // Handle errors gracefully and log the details
    if (error.response) {
      console.error('Error calling Gemini API:', error.response.data);
      return `Error: ${error.response.data.error?.message || 'Unknown error'}`;
    } else if (error.request) {
      console.error('Error with request:', error.request);
      return 'Error: The request to the API failed. Please try again later.';
    } else {
      console.error('General error:', error.message);
      return `Error: ${error.message || 'Unknown error'}`;
    }
  }
};
