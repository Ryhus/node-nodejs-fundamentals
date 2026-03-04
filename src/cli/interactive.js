import * as readline from "node:readline";
import {
  uptime,
  cwd,
  exit,
  stdin as input,
  stdout as output,
} from "node:process";

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const rl = readline.createInterface({ input, output, prompt: "> " });
  rl.prompt();

  rl.on("line", (line) => {
    switch (line.trim()) {
      case "cwd":
        console.log(`Current directory: ${cwd()}`);
        break;
      case "uptime":
        console.log(`Process uptime: ${uptime().toFixed(2)}s`);
        break;
      case "date":
        const date = new Date().toISOString();
        console.log(`Current Date: ${date}`);
        break;
      case "exit":
        rl.close();
        break;
      default:
        console.log(`Unknown command`);
        break;
    }
    rl.prompt();
  }).on("close", () => {
    console.log("Goodbye!");
    exit(0);
  });

  rl.on("SIGINT", () => {
    rl.close();
  });
};

interactive();
