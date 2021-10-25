const fs = require("fs");
const chalk = require("chalk");
const { spawnSync } = require("child_process");
const spawnargs = require("spawn-args");

function runSync(cmd, verbose = true) {
  console.log(`Running ${chalk.yellow(cmd)}`);
  const args = spawnargs(cmd);
  const process = spawnSync(args[0], args.slice(1), {
    shell: true,
    encoding: "utf8",
  });
  if (verbose) {
    console.log(chalk.green(process.stdout));
  }
  return process;
}

function getAbsolutePath(relativePath) {
  return `${process.cwd()}/${relativePath}`;
}

function readJsonFile(relativePath, verbose = true) {
  const absolutePath = getAbsolutePath(relativePath);
  if (verbose) {
    console.log(`Trying to read the file ${chalk.yellow(absolutePath)}`);
  }
  return JSON.parse(fs.readFileSync(absolutePath));
}

function isDir(relativePath) {
  const absolutePath = getAbsolutePath(relativePath);
  try {
    var stat = fs.lstatSync(absolutePath);
    return stat.isDirectory();
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
}

module.exports = {
  runSync,
  readJsonFile,
  isDir,
};
