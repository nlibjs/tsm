import * as assert from 'node:assert';
import * as path from 'node:path';
import { describe, test } from 'node:test';
import { getErrorStack } from './nested/getErrorStack.mjs';

describe('trace', () => {
  test('trace', () => {
    const firstLine = getErrorStack().split('\n')[1].split(path.sep).join('/');
    assert.ok(
      firstLine.endsWith('/coverage-off/nested/getErrorStack.mts:3:13)'),
      `UnexpectedLocation: ${firstLine}`,
    );
  });
});
