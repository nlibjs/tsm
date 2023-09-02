/* eslint-disable func-style */
export function getErrorStack(...args: Array<number>): string;
export function getErrorStack(...args: Array<string>): string;
export function getErrorStack(...args: Array<unknown>) {
  return `${new Error(`GetErrorStack: ${args.join(',')}`).stack}`;
}
