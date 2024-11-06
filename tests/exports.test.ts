import {describe, expect, it} from 'vitest';

import * as OcrLLM from '../src';

describe('OcrLLM exports', () => {
  it('should export OcrLLM class', () => {
    expect(OcrLLM.OcrLLM).toBeDefined();
    expect(typeof OcrLLM.OcrLLM).toBe('function');
  });

  it('should not export any unexpected items', () => {
    const expectedExports = [
      'OcrLLM',
      'OcrLLMConfig',
      'PageResult',
      'ImageResult',
      'InputSource',
      'OCRMetadata',
      'Provider',
    ];
    const actualExports = Object.keys(OcrLLM);

    expect(actualExports).toEqual(expect.arrayContaining(expectedExports));
    expect(actualExports.length).toBe(expectedExports.length);
  });
});
