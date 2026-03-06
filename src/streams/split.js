import { createReadStream, createWriteStream } from "node:fs";
import { argv } from "node:process";

const split = async () => {
  // Write your code here
  // Read source.txt using Readable Stream
  // Split into chunk_1.txt, chunk_2.txt, etc.
  // Each chunk max N lines (--lines CLI argument, default: 10)

  let lines = 10;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--lines" && argv[i + 1]) {
      lines = Number(argv[i + 1]);
    }
  }

  let lineCounter = 0;
  let file_number = 1;
  let writeStream = createWriteStream(`./chunk_${file_number}.txt`);

  const fileStream = createReadStream("./source.txt");

  fileStream.on("data", (chunk) => {
    const data = chunk.toString().split("\n");

    for (const line of data) {
      writeStream.write(line + `\n`);
      lineCounter += 1;
      if (lineCounter === lines) {
        file_number += 1;
        lineCounter = 0;
        writeStream = createWriteStream(`./chunk_${file_number}.txt`);
      }
    }
  });
};

await split();
