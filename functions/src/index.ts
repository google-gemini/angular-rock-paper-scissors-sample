import {GoogleGenerativeAI,
  HarmBlockThreshold, HarmCategory} from '@google/generative-ai';
import {onCall} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

interface FunctionResponse {
  data: string;
  status: 'success' | 'error';
}

export const askGemini = onCall(async (request): Promise<FunctionResponse> => {
  try {
    if (!process.env.API_KEY) {
      return {
        status: 'error',
        data: `Please set API_KEY in environment variables!
          If you need to create one, please follow this instruction:
          https://aistudio.google.com/app/apikey.`,
      };
    }
    logger.info('Get model', {structuredData: true});
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });
    logger.info(`Ask Gemini: ${request.data.prompt}`, {structuredData: true});
    const contentResult = await model.generateContent(request.data.prompt);
    if (!contentResult.response.candidates) {
      throw new Error('Gemini response has incorrect format!');
    }
    const message = contentResult.response.candidates[0].content.parts[0].text;
    return {
      status: 'success',
      data: message ?? '',
    };
  } catch (err) {
    logger.info(err);
    return {
      status: 'error',
      data: `Unexpected error happened: ${JSON.stringify(err)}`,
    };
  }
});
