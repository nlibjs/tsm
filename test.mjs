#!/usr/bin/env node
/**
 * https://nodejs.org/api/test.html#test-runner-execution-model
 */
import { execSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { program } from 'commander';
import mm from 'micromatch';

/** @type {{version: string}} */
const { version } = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url)),
);

program
  .name('nlib-mts-test')
  .version(version)
  .usage('[options] -- [directoriesOrPatterns...]')
  .argument(
    '[directoriesOrPatterns...]',
    'Directories or micromatch patterns to match test files',
  )
  .option('-e, --exclude <patterns...>', 'Patterns to exclude files')
  .option(
    '-c, --coverage',
    'Enables --experimental-test-coverage\nhttps://nodejs.org/api/cli.html#--experimental-test-coverage',
  )
  .parse();

const rootDir = pathToFileURL(process.cwd().replace(/\/*$/, '/'));
/** @param {URL} file  */
const relativePath = (file) => file.pathname.slice(rootDir.pathname.length);
/** @type {Array<string>} */
const patterns = [];
{
  const patternsOrDirectories = program.args;
  const basePatterns = [
    '**/*.test.*(m)+(j|t)s*(x)',
    '**/test/**/*.*(m)+(j|t)s*(x)',
  ];
  if (patternsOrDirectories.length === 0) {
    patterns.push(...basePatterns);
  } else {
    /** @param {URL} file  */
    const statOrNull = async (file) => await stat(file).catch(() => null);
    for (let patternOrDirectory of patternsOrDirectories) {
      patternOrDirectory = patternOrDirectory.replace(/\/*$/, '');
      const stats = await statOrNull(new URL(patternOrDirectory, rootDir));
      if (stats && stats.isDirectory()) {
        patterns.push(...basePatterns.map((p) => `${patternOrDirectory}/${p}`));
      } else {
        patterns.push(patternOrDirectory);
      }
    }
  }
}

const {
  /** @type {Array<string>} */
  exclude: excludePatterns = [],
  /** @type {boolean} */
  coverage = false,
} = program.opts();
const files = [];
{
  excludePatterns.push('**/node_modules', '**/.*');
  /** @param {URL} file  */
  const isExternalFile = (file) => !file.pathname.startsWith(rootDir.pathname);
  /** @param {URL} file  */
  const isExcludedFile = (file) => {
    if (isExternalFile(file)) {
      return true;
    }
    return mm.isMatch(relativePath(file), excludePatterns, { dot: true });
  };
  /** @param {URL} file  */
  const isTestFile = (file) => {
    if (isExternalFile(file)) {
      return false;
    }
    return mm.isMatch(relativePath(file), patterns, { dot: false });
  };
  /** @param {URL} file  */
  const listFiles = async function* (file) {
    if (isExcludedFile(file)) {
      return;
    }
    const stats = await stat(file);
    if (stats.isDirectory()) {
      file = new URL(file);
      if (!file.pathname.endsWith('/')) {
        file.pathname += '/';
      }
      for (const name of await readdir(file)) {
        yield* listFiles(new URL(name, file));
      }
    } else if (stats.isFile() && isTestFile(file)) {
      yield file;
    }
  };
  for await (const file of listFiles(rootDir)) {
    files.push(file);
  }
}

let command = 'node';
const loaderFile = new URL('./loader.mjs', import.meta.url);
command += ` --experimental-loader=${loaderFile}`;
if (coverage) {
  command += ' --experimental-test-coverage';
}
command += ' --test';
for (const file of files) {
  command += ` ${fileURLToPath(file)}`;
}
execSync(command, {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});
