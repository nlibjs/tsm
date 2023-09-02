import { describe, test } from 'node:test';
import * as assert from 'node:assert';
import { getErrorStack } from './nested/getErrorStack.mjs';

describe('trace', () => {
  test('trace', () => {
    const stack = getErrorStack();
    const firstLine = stack.split('\n')[1].trim();
    assert.ok(
      firstLine.endsWith('/coverage-on/nested/getErrorStack.mts:5:13)'),
      `UnexpectedLocation: ${firstLine}`,
    );
  });
});
