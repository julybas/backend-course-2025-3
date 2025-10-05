const { program } = require("commander");
const fs = require("fs");

program
  .requiredOption("-i, --input <path>", "input file path")
  .option("-o, --output <path>", "output file path")
  .option("-d, --display <count>", "display result in console")
  .option("--date", "show FL_DATE before distance and airtime")
  .option("-a, --airtime <minutes>", "only flights with AIR_TIME > value");

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

// Читання файлу
let fileContent;
try {
  fileContent = fs.readFileSync(options.input, "utf8");
} catch (err) {
  console.error("Error reading file:", err.message);
  process.exit(1);
}

const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

let result = "";
let displayCount = 0;
const maxDisplay = options.display || Infinity;

for (const line of lines) {
  try {
    const obj = JSON.parse(line);

    // Перевіряємо наявність і типи полів
    const airTime = Number(obj.AIR_TIME) || 0;
    const distance = Number(obj.DISTANCE) || 0;
    const date = obj.FL_DATE || "Unknown";

    // Фільтр за airtime
    if (options.airtime && airTime <= Number(options.airtime)) continue;

    // Формування рядка
    let output = "";
    if (options.date) output += `${date} `;
    output += `${airTime} ${distance}`;

    if (options.display && displayCount < maxDisplay) {
      console.log(output);
      displayCount++;
    }

    result += output + "\n";
  } catch (err) {
    console.error("Error parsing line:", line);
  }
}

// Запис у файл
if (options.output) {
  try {
    fs.writeFileSync(options.output, result);
  } catch (err) {
    console.error("Error writing file:", err.message);
  }
}
