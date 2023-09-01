import { describe, test } from 'node:test';
import assert from 'node:assert';
import { isString } from '@nlib/typing';
import { add } from './add.mjs';

describe('add', () => {
  test('1 + 2 = 3', () => {
    assert.equal(add(1, 2), 3);
  });
  test('isString', () => {
    assert.equal(isString(0), false);
  });
});
