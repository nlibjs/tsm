import { describe, test } from 'node:test';
import assert from 'node:assert';
import { isString } from '@nlib/typing';
import { multiply } from './multiply.mjs';

describe('multiply', () => {
  test('2 * 3 = 6', () => {
    assert.equal(multiply(2, 3), 6);
  });
  test('isString', () => {
    assert.equal(isString(0), false);
  });
});
