import {describe, expect, it} from 'vitest';

import * as Ocra from '../src';

describe('Ocra exports', () => {
  it('should export Ocra class', () => {
    expect(Ocra.Ocra).toBeDefined();
    expect(typeof Ocra.Ocra).toBe('function');
  });

  it('should not export any unexpected items', () => {
    const expectedExports = ['Ocra'];
    const actualExports = Object.keys(Ocra);

    expect(actualExports).toEqual(expect.arrayContaining(expectedExports));
    expect(actualExports.length).toBe(expectedExports.length);
  });
});
