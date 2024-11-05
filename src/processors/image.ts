import {promises as fs} from 'fs';

import {_pm, report} from '../logger';
import {ImageResult, InputSource, Provider} from '../types';
import {callLLM} from '../utils/call-llm';
import {removeCodeBlockMarkers} from '../utils/string';

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
  try {
    let imageBuffer: Buffer;

    if (typeof input === 'string') {
      try {
        if (input.startsWith('http')) {
          const response = await fetch(input);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch image: ${response.status} ${response.statusText}`,
            );
          }
          imageBuffer = Buffer.from(await response.arrayBuffer());
        } else if (input.startsWith('data:image')) {
          imageBuffer = Buffer.from(input.split(',')[1], 'base64');
        } else {
          imageBuffer = await fs.readFile(input);
        }
      } catch (error: unknown) {
        throw new Error(`Failed to read image input: ${_pm(error)}`);
      }
    } else {
      imageBuffer = input;
    }

    if (!imageBuffer?.length) {
      throw new Error('Empty or invalid image buffer');
    }

    const base64Image = imageBuffer.toString('base64');
    const content = await callLLM(apiKey, base64Image, provider);

    return {
      content: removeCodeBlockMarkers(content),
      metadata: {
        size: imageBuffer.length,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: unknown) {
    report(error);
    return {
      content: '',
      metadata: {
        error: _pm(error),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
