# @nlib/tsm

Thin .mts loader and test runner

[![.github/workflows/test.yml](https://github.com/nlibjs/tsm/actions/workflows/test.yml/badge.svg)](https://github.com/nlibjs/tsm/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/nlibjs/tsm/graph/badge.svg?token=5fr51K5wli)](https://codecov.io/gh/nlibjs/tsm)

## Install

```
npm install @nlib/tsm
```

## Usage: Run \*.ts/\*.mts file

```
node --import=@nlib/tsm path/to/your/script.mts
```

`@nlib/tsm` exports `register.mjs` which [registers](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options) `loader.mjs`. `loader.mjs` is a [loader](https://nodejs.org/api/esm.html#loaders) to customize the default module resolution. It exports the [`load`](https://nodejs.org/api/esm.html#loadurl-context-nextload) function that loads modules with [esbuild](https://esbuild.github.io/).

## Usage: Run test files

Node.js added the stable [`node:test`](https://nodejs.org/api/test.html) in v20. We can run tests with `node --test`. It searches for test files when a directory is specified as arguments. But it doesn't search for `*.mts` (even with the `--experimental-loader` option). So, you must pass the files one by one to run it.

The `tsm-test` will search for the test files for you and pass them to `node --test`.

```sh
npx tsm-test src
```
