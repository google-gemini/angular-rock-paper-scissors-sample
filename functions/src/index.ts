/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from '@google/generative-ai';
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
      data: `Unexpected error happened. Please check Firebase logs.
        Please check if you're using Gemini API from an available region.
        List of the available regions: List of available regions is visible here: https://ai.google.dev/gemini-api/docs/available-regions.
      `,
    };
  }
});
