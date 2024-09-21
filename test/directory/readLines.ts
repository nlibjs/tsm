import { readNonCommentLine } from "@nlib/lint-commit/lib/readNonCommentLine.mjs";

export const readLines = function* (source: string): Generator<string> {
	yield* readNonCommentLine(source);
};
