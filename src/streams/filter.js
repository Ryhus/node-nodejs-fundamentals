import { Transform } from "node:stream";
import { stdin, stdout, argv } from "node:process";

const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout

  let pattern;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--pattern" && argv[i + 1]) {
      pattern = new RegExp(`^${argv[i + 1]}$`, "i");
    }
  }

  const filterLines = new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString();
      const lines = text.trim().split("\n");

      try {
        for (const line of lines) {
          if (pattern.test(line)) {
            this.push(line + "\n");
            callback();
          }
        }
      } catch {
        callback(null, text);
      }
    },
  });

  stdin.pipe(filterLines).pipe(stdout);
};

filter();
