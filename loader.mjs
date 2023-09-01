//@ts-check
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

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
  if (/\.m?[tj]sx?$/.test(url)) {
    const result = await esbuild.build({
      entryPoints: [fileURLToPath(url)],
      plugins: [markExternalPlugin],
      format: 'esm',
      bundle: true,
      write: false,
      sourcemap: 'inline',
    });
    return {
      format: 'module',
      shortCircuit: true,
      source: result.outputFiles[0].contents,
    };
  }
  return nextLoad(url, context);
};

/** @type {esbuild.Plugin} */
const markExternalPlugin = {
  name: 'mark-external',
  setup(build) {
    build.onResolve({ filter: /./ }, (args) => {
      if (!args.importer) {
        return null;
      }
      if (args.path.startsWith('.')) {
        return { path: args.path.replace(/\.mjs$/, '.mts'), external: true };
      }
      return { path: args.path, external: true };
    });
  },
};
