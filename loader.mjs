//@ts-check
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const sourcemap = process.env.NODE_V8_COVERAGE;

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
    /** @type {esbuild.BuildOptions} */
    const options = {
      entryPoints: [filePath],
      plugins: [markExternalPlugin],
      format: 'esm',
      bundle: true,
    };
    /** @type {Uint8Array | undefined} */
    let source;
    if (sourcemap) {
      const cwd = process.cwd();
      const outfile = path.resolve(
        cwd,
        sourcemap,
        path.relative(cwd, filePath).replace(/ts$/, 'js'),
      );
      const relativePath = path.relative(filePath, outfile);
      /** @todo This won't work. */
      await esbuild.build({
        ...options,
        write: true,
        footer: { js: `//# sourceMappingURL=${relativePath}.map` },
        sourcemap: 'external',
        outfile,
      });
      source = await fs.readFile(outfile);
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
