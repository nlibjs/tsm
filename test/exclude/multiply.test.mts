import assert from 'node:assert';
import { describe, test } from 'node:test';
import { multiply } from './multiply.mjs';

describe('multiply', () => {
  test('2 * 3 = 6', () => {
    assert.equal(multiply(2, 3), 6);
  });
});
