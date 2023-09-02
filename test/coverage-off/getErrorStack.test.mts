import { describe, test } from 'node:test';
import * as assert from 'node:assert';
import { getErrorStack } from './nested/getErrorStack.mjs';

describe('trace', () => {
  test('trace', () => {
    const firstLine = getErrorStack().split('\n')[1].trim();
    assert.ok(
      firstLine.endsWith('/coverage-off/nested/getErrorStack.mts:3:13)'),
      `UnexpectedLocation: ${firstLine}`,
    );
  });
});
