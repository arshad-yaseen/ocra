import {promises as fs} from 'fs';

import {ImageResult, InputSource, Provider} from '../types';
import {callLLM} from '../utils/call-llm';

/**
 * Processes an image input and extracts text content.
 * @param input - Image input source.
 * @param apiKey - API key for authentication.
 * @returns The extracted text and metadata.
 */
export async function processImage(
  input: InputSource,
  provider: Provider,
  apiKey: string,
): Promise<ImageResult> {
  let imageBuffer: Buffer;

  if (typeof input === 'string') {
    if (input.startsWith('http')) {
      const response = await fetch(input);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else if (input.startsWith('data:image')) {
      imageBuffer = Buffer.from(input.split(',')[1], 'base64');
    } else {
      imageBuffer = await fs.readFile(input);
    }
  } else {
    imageBuffer = input;
  }

  const base64Image = imageBuffer.toString('base64');
  const content = await callLLM(apiKey, base64Image, provider);

  return {
    content,
    metadata: {
      size: imageBuffer.length,
      timestamp: new Date().toISOString(),
    },
  };
}
