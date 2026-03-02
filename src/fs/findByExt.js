import { argv } from "node:process";
import path from "node:path";
import fs from "node:fs/promises";

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  const pathToWorkspace = "./home/user/workspace";
  let ext = ".txt";
  const relativePathes = [];

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--ext") {
      ext = argv[i + 1] || ".txt";
      if (ext.at(0) !== ".") ext = "." + ext;
    }
  }
  try {
    const dir = await fs.opendir(pathToWorkspace, { recursive: true });

    for await (const dirent of dir) {
      if (dirent.isFile() & (path.extname(dirent.name) === ext)) {
        const pathToEntrie = path.join(dirent.parentPath, dirent.name);
        const relativePath = path.relative(pathToWorkspace, pathToEntrie);
        relativePathes.push(relativePath);
      }
    }
    relativePathes.sort((a, b) => a.localeCompare(b));
    relativePathes.forEach((relativePath) => console.log(relativePath));
  } catch (err) {
    throw new Error("FS operation failed");
  }
};

await findByExt();
