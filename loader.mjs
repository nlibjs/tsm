/* eslint-disable no-console */
//@ts-check
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const sourceRoot =
  process.env.NODE_V8_COVERAGE && `${pathToFileURL(process.cwd())}/`;

/**
 * https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
 * @typedef {Record<string, unknown>} ImportAssertions
 * @typedef {{conditions: Array<string>, importAssertions: ImportAssertions, parentURL?: string}} ResolveContext
 * @typedef {{format?: string | null, importAssertions: ImportAssertions, shortCircuit?: boolean, url: string}} ResolveResult
 * @param {string} specifier
 * @param {ResolveContext} context
 * @param {(specifier: string, context: ResolveContext) => ResolveResult | Promise<ResolveResult>} nextResolve
 * @returns {ResolveResult | Promise<ResolveResult>}
 */
// export const resolve = (specifier, context, nextResolve) => {
//   return nextResolve(specifier, context);
// };

/**
 * https://nodejs.org/api/esm.html#loadurl-context-nextload
 * @typedef {{conditions: Array<string>, importAssertions: ImportAssertions, format?: string | null}} LoadContext
 * @typedef {{format: string, shortCircuit?: boolean, source: string | ArrayBuffer | Uint8Array}} LoadResult
 * @param {string} url
 * @param {LoadContext} context
 * @param {(specifier: string, context: LoadContext) => LoadResult | Promise<LoadResult>} nextLoad
 * @returns {Promise<LoadResult>}
 */
export const load = async (url, context, nextLoad) => {
  if (url.startsWith('file://')) {
    const filePath = fileURLToPath(url);
    if (!url.includes('/node_modules/') && /\.m?[tj]sx?$/.test(url)) {
      /** @type {esbuild.BuildOptions} */
      const options = {
        entryPoints: [filePath],
        plugins: [markExternalPlugin],
        format: 'esm',
        bundle: true,
        write: false,
      };
      if (sourceRoot) {
        options.sourcemap = 'inline';
        options.sourceRoot = sourceRoot;
      }
      const result = await esbuild.build({ ...options, write: false });
      return {
        format: 'module',
        shortCircuit: true,
        source: result.outputFiles[0].contents,
      };
    }
    if (!/[^/]\.\w+$/.test(url)) {
      /**
       * Workaround for ERR_UNKNOWN_FILE_EXTENSION
       * Read the file here instead of nextLoad if extension is missing.
       * @example
       * $ NODE_OPTIONS='--experimental-loader=@nlib/tsm' next
       * > TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension "" for
       * > node_modules/next/dist/bin/next
       */
      const source = await fs.readFile(filePath, 'utf8');
      let format = 'commonjs';
      if (/^;?\s*(?:import|export)\W/.test(source)) {
        format = 'module';
      }
      return { format, shortCircuit: true, source };
    }
  }
  return nextLoad(url, context);
};

/** @type {esbuild.Plugin} */
const markExternalPlugin = {
  name: 'mark-external',
  setup(build) {
    /** @param {string} file */
    const checkFile = async (file) => (await fs.stat(file)) && file;
    /** @param {esbuild.OnResolveArgs} args */
    const findImportee = async (args) => {
      const resolved = path.resolve(args.resolveDir, args.path);
      const results = await Promise.allSettled([
        checkFile(resolved),
        checkFile(resolved.replace(/js$/, 'ts')),
      ]);
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const ext = path.extname(result.value);
          return `${args.path.slice(0, -ext.length)}${ext}`;
        }
      }
      return null;
    };
    build.onResolve({ filter: /./ }, async (args) => {
      if (!args.importer) {
        return null;
      }
      if (args.path.startsWith('.')) {
        const importee = await findImportee(args);
        if (importee) {
          return { path: importee, external: true };
        }
      }
      return { path: args.path, external: true };
    });
  },
};
