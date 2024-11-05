import {promises as fs} from 'fs';
import * as os from 'os';
import * as path from 'path';

import {PDFDocument} from 'pdf-lib';
import {fromPath} from 'pdf2pic';

import {ConcurrencyLimit} from '../classes/concurrency-limit';
import {MAX_CONCURRENT_REQUESTS} from '../constants';
import {_pm, report} from '../logger';
import {InputSource, PageResult, Provider} from '../types';
import {processImage} from './image';

/**
 * Processes a PDF input and extracts text content from each page.
 * @param input - PDF input source.
 * @param apiKey - API key for authentication.
 * @returns An array of extracted text and metadata for each page.
 */
export async function processPdf(
  input: InputSource,
  provider: Provider,
  apiKey: string,
): Promise<PageResult[]> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocra-'));
  const tempPdfPath = path.join(tempDir, 'temp.pdf');
  const limiter = new ConcurrencyLimit(MAX_CONCURRENT_REQUESTS);

  try {
    // Save input to temporary PDF file
    let pdfBuffer: Buffer;

    if (typeof input === 'string') {
      if (input.startsWith('http')) {
        const response = await fetch(input);
        pdfBuffer = Buffer.from(await response.arrayBuffer());
      } else if (input.startsWith('data:application/pdf')) {
        pdfBuffer = Buffer.from(input.split(',')[1], 'base64');
      } else {
        pdfBuffer = await fs.readFile(input);
      }
    } else {
      pdfBuffer = input;
    }

    await fs.writeFile(tempPdfPath, pdfBuffer);

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    const options = {
      density: 300,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 2480,
      height: 3508,
    };

    const convert = fromPath(tempPdfPath, options);

    // Convert pages to images concurrently
    const pages = await Promise.all(
      Array.from({length: pageCount}, (_, i) => i + 1).map(pageNum =>
        limiter.run(async () => {
          try {
            const result = await convert(pageNum);
            if (!result?.path) {
              throw new Error('Failed to convert PDF page to image');
            }
            const imageBuffer = await fs.readFile(result.path);
            await fs.unlink(result.path);
            return {
              buffer: imageBuffer,
              pageNum,
            };
          } catch (error) {
            report(error);
            throw error;
          }
        }),
      ),
    );

    // Process all pages concurrently
    const results = await Promise.all(
      pages.map(({buffer, pageNum}) =>
        limiter.run(async () => {
          try {
            const result = await processImage(buffer, provider, apiKey);
            return {
              page: pageNum,
              content: result.content,
              metadata: {
                ...result.metadata,
                pageNumber: pageNum,
              },
            };
          } catch (error: unknown) {
            report(error);
            return {
              page: pageNum,
              content: '',
              metadata: {
                error: _pm(error),
                pageNumber: pageNum,
              },
            };
          }
        }),
      ),
    );

    return results.sort((a, b) => a.page - b.page);
  } finally {
    // Clean up temporary directory
    try {
      await fs.rm(tempDir, {recursive: true, force: true});
    } catch (error) {
      report(error);
    }
  }
}
