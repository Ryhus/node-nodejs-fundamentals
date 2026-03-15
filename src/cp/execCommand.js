import { spawn } from "node:child_process";
import { argv } from "node:process";

const execCommand = () => {
  // Write your code here
  // Take command from CLI argument
  // Spawn child process
  // Pipe child stdout/stderr to parent stdout/stderr
  // Pass environment variables
  // Exit with same code as child

  const command = argv[2];

  const child = spawn(command, {
    shell: true,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  child.on("exit", (code) => {
    process.exit(code);
  });

  child.on("error", (err) => {
    console.error("Failed to start child process:", err);
    process.exit(1);
  });
};

execCommand();
