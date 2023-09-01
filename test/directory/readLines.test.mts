import * as assert from 'node:assert';
import { test } from 'node:test';
import { readLines } from './readLines.js';

test('readLines', () => {
  const source: string = [
    '# comment1',
    'line 1',
    '# comment2',
    'line 2',
    '# comment3',
    'line 3',
  ].join('\n');
  assert.deepStrictEqual(
    [...readLines(source)],
    ['line 1', 'line 2', 'line 3'],
  );
});
