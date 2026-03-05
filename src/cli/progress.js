import { stdout, argv } from "node:process";

const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%

  let duration = 5000;
  let interval = 100;
  let length = 30;
  let color;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--duration" && argv[i + 1]) {
      duration = Number(argv[i + 1]);
    }
    if (argv[i] === "--interval" && argv[i + 1]) {
      interval = Number(argv[i + 1]);
    }
    if (argv[i] === "--length" && argv[i + 1]) {
      length = Number(argv[i + 1]);
    }
    if (argv[i] === "--color" && argv[i + 1]) {
      color = argv[i + 1];
    }
  }

  function colorProgressBar(color, text) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return text;

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
  }

  const progressBar = color ? colorProgressBar(color, "█") : "█";

  let currentInterval = 0;

  function writeProgressBar(duration, interval, length) {
    currentInterval += interval;

    const currentProgress = currentInterval / duration;
    const percent = Math.floor(currentProgress * 100);
    const filledBarPart = Math.floor(currentProgress * length);
    const emptyBarPart = length - filledBarPart;

    stdout.write(
      `\r[${progressBar.repeat(filledBarPart)}${" ".repeat(emptyBarPart)}] ${percent}%`,
    );

    if (currentInterval >= duration) {
      clearInterval(id);
      stdout.write("\n");
      console.log("Done!");
    }
  }

  const id = setInterval(
    writeProgressBar,
    interval,
    duration,
    interval,
    length,
  );
};

progress();
