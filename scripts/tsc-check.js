#!/usr/bin/env node
const chalk = require("chalk");
const minimatchAll = require("minimatch-all");
const { runSync, readJsonFile, isDir } = require("./lib");

function tscCheck() {
  const tsconfig = readJsonFile("tsconfig.json");
  const exclude = tsconfig.exclude.map((path) =>
    isDir(path) ? `${path}/**/*` : path
  );

  const tsc = runSync("yarn tsc --pretty false", false);
  const lines = tsc.stdout.split("\n");

  // prettier-ignore
  const regexp = /^(.+?)\((\d+),(\d+)\): error TS(\d+): (.+)$/g;

  const errors = [];
  lines.forEach((line) => {
    const matches = regexp.exec(line.trim());
    if (matches) {
      const [output, path, errorLine, errorColumn, errorCode, errorMessage] =
        matches;
      const error = {
        output,
        path,
        errorLine: parseInt(errorLine),
        errorColumn: parseInt(errorColumn),
        errorCode: parseInt(errorCode),
        errorMessage,
      };
      if (!minimatchAll(path, exclude)) {
        errors.push(error);
      }
    }
  });

  if (errors.length === 0) {
    process.exitCode = 0; // success
    console.log(chalk.green("No TypeScript errors were found."));
  } else {
    process.exitCode = 1; // error
    const errorsString = errors.map((error) => error.output).join("\n");
    console.log(chalk.yellow(`${errors.length} TypeScript errors were found:`));
    console.log(chalk.bgRed(errorsString));
  }
}

tscCheck();
