import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { logService } from './logService';
import { GOOGLE_API_KEY } from '@env';

export interface TaskDetails {
  description: string;
  time: string;
}

const google = GOOGLE_API_KEY ? createGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
}) : null;

class GeminiAIService {
  async processTextInput(text: string): Promise<TaskDetails> {
    if (!text) {
      logService.warn('Input text cannot be empty.');
      throw new Error('Input text cannot be empty.');
    }

    if (!google) {
        logService.warn('Using mock Gemini AI response. Please provide a Google AI API key in .env file.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          description: `Task: ${text}`,
          time: 'Tomorrow at 10 AM',
        };
      }

    try {
      const result = await streamText({
        model: google('models/gemini-1.5-flash-latest'),
        prompt: `Extract the task description and a specific time from the following text.
                 If no specific time is mentioned, suggest a reasonable time.
                 Return the result as a JSON object with "description" and "time" fields.
                 Text: "${text}"`,
      });

      let fullResponse = '';
      for await (const delta of result.textStream) {
        fullResponse += delta;
      }

      const parsedResponse = JSON.parse(fullResponse);

      return {
        description: parsedResponse.description || 'No description found',
        time: parsedResponse.time || 'No time found',
      };

    } catch (error) {
      logService.error('Error processing text with Gemini AI:', error);
      throw new Error('Failed to process text with Gemini AI.');
    }
  }
}

export const geminiAIService = new GeminiAIService();