import { describe, test } from 'node:test';
import assert from 'node:assert';
import { add } from './add.mjs';

describe('add', () => {
  test('1 + 2 = 3', () => {
    assert.equal(add(1, 2), 3);
  });
});
