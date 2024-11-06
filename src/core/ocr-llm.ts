import {SUPPORTED_PROVIDERS} from '../constants';
import {InvalidProviderError} from '../errors';
import {processImage} from '../processors/image';
import {processPdf} from '../processors/pdf';
import {ImageResult, InputSource, OcrLLMConfig, PageResult} from '../types';

/**
 * Main class for the OcrLLM OCR engine.
 */
export class OcrLLM {
  private readonly config: OcrLLMConfig;

  /**
   * @param config - Configuration options for OcrLLM.
   */
  constructor(config: OcrLLMConfig) {
    if (!SUPPORTED_PROVIDERS.includes(config.provider)) {
      throw new InvalidProviderError(config.provider);
    }
    this.config = config;
  }

  /**
   * Processes an image and extracts text content.
   * @param input - Image input source.
   * @returns The extracted text and metadata.
   */
  async image(input: InputSource): Promise<ImageResult> {
    return processImage(input, this.config.provider, this.config.key);
  }

  /**
   * Processes a PDF and extracts text content from each page.
   * @param input - PDF input source.
   * @returns An array of extracted text and metadata for each page.
   */
  async pdf(input: InputSource): Promise<PageResult[]> {
    return processPdf(input, this.config.provider, this.config.key);
  }
}
