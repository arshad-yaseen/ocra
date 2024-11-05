import {SUPPORTED_PROVIDERS} from '../constants';

export * from './provider';

/**
 * Supported OCR providers.
 */
export type Provider = (typeof SUPPORTED_PROVIDERS)[number];

/**
 * Configuration options for Ocra.
 */
export interface OcraConfig {
  /** The OCR provider to use. */
  provider: Provider;
  /** API key for the selected provider. */
  key: string;
}

/**
 * Metadata for OCR processing results.
 */
export interface OCRMetadata {
  /** Timestamp when the processing was completed */
  timestamp?: string;
  /** Size of the processed file in bytes */
  size?: number;
  /** Page number for multi-page documents */
  pageNumber?: number;
  /** Error message if processing failed */
  error?: string;
}

/**
 * Result of OCR processing for a single page.
 */
export interface PageResult {
  /** Page number in the document. */
  page: number;
  /** Extracted text content. */
  content: string;
  /** Optional metadata about the page. */
  metadata?: OCRMetadata;
}

/**
 * Result of OCR processing for a single image.
 */
export interface ImageResult {
  /** Extracted text content. */
  content: string;
  /** Optional metadata about the image. */
  metadata?: OCRMetadata;
}

/**
 * Input source for OCR processing.
 * Can be a URL, file path, base64 string, or Buffer.
 */
export type InputSource = string | Buffer;
