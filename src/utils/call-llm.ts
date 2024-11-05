import {
  API_ENDPOINTS,
  PROMPT_TEMPLATE,
  REQUEST_TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
} from '../constants';
import {delay} from '../utils/delay';
import {fetchWithTimeout} from './fetch-with-timeout';

/**
 * Calls the Language Model to extract text from the image.
 * @param apiKey - API key for authentication.
 * @param imageBase64 - Base64-encoded image string.
 * @returns Extracted text content.
 */
export async function callLLM(
  apiKey: string,
  imageBase64: string,
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(
        API_ENDPOINTS.openai,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  {type: 'text', text: PROMPT_TEMPLATE},
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${imageBase64}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 2000,
          }),
        },
        REQUEST_TIMEOUT,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS - 1) {
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }
      throw new Error(
        `Failed after ${RETRY_ATTEMPTS} attempts: ${error.message}`,
      );
    }
  }

  throw lastError;
}
