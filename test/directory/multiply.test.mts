import { describe, test } from 'node:test';
import assert from 'node:assert';
import { multiply } from './multiply.mjs';

await describe('multiply', async () => {
  await test('2 * 3 = 6', () => {
    assert.equal(multiply(2, 3), 6);
  });
});
