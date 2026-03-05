import { stdin, stdout } from "node:process";
import { Transform } from "node:stream";

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout

  const tranformLines = new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString();
      const lines = text.trim().split("\n");

      const preapended = lines
        .map((line, index) => `${index + 1} | ${line}\n`)
        .join("");

      callback(null, preapended);
    },
  });

  stdin.pipe(tranformLines).pipe(stdout);
};

lineNumberer();
