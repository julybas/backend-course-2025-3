const { program } = require("commander");
const fs = require("fs");

program
  .requiredOption("-i, --input <path>", "input file path")
  .option("-o, --output <path>", "output file path")
  .option("-d, --display <count>", "display result in console");

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

if (!options.output && !options.display) {
  process.exit(0);
}
