//@ts-check
import { fileURLToPath } from 'node:url';
import { resolve, extname, relative, dirname } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
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
  if (!url.includes('/node_modules/') && /\.m?[tj]sx?$/.test(url)) {
    const filePath = fileURLToPath(url);
    /** @type {import('esbuild').BuildOptions} */
    const options = {
      entryPoints: [filePath],
      plugins: [markExternalPlugin],
      format: 'esm',
      bundle: true,
    };
    const sourcemap = process.env.NODE_V8_COVERAGE;
    /** @type {Uint8Array | undefined} */
    let source;
    if (sourcemap) {
      const cwd = process.cwd();
      const outfile = resolve(cwd, sourcemap, relative(cwd, filePath));
      const relativePath = relative(dirname(filePath), outfile);
      await esbuild.build({
        ...options,
        write: true,
        footer: { js: `//# sourceMappingURL=${relativePath}.map` },
        sourcemap: 'external',
        outfile,
      });
      source = await readFile(outfile);
    } else {
      const result = await esbuild.build({ ...options, write: false });
      source = result.outputFiles[0].contents;
    }
    return { format: 'module', shortCircuit: true, source };
  }
  return nextLoad(url, context);
};

/** @type {esbuild.Plugin} */
const markExternalPlugin = {
  name: 'mark-external',
  setup(build) {
    /** @param {string} file */
    const checkFile = async (file) => {
      await stat(file);
      return file;
    };
    build.onResolve({ filter: /./ }, async (args) => {
      if (!args.importer) {
        return null;
      }
      if (args.path.startsWith('.')) {
        const resolved = resolve(args.resolveDir, args.path);
        const results = await Promise.allSettled([
          checkFile(resolved),
          checkFile(resolved.replace(/js$/, 'ts')),
        ]);
        for (const result of results) {
          if (result.status === 'fulfilled') {
            const ext = extname(result.value);
            return {
              path: `${args.path.slice(0, -ext.length)}${ext}`,
              external: true,
            };
          }
        }
      }
      return { path: args.path, external: true };
    });
  },
};
