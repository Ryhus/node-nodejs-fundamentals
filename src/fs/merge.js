import { argv } from "node:process";
import path from "node:path";
import fs from "node:fs/promises";

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const pathToParts = "./home/user/workspace/parts";
  const pathToWritingFile = "./home/user/workspace/merged.txt";
  const ext = ".txt";
  const pathesToFiles = [];
  const filesToMerge = [];

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--files") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        const parts = argv[i + 1]
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);
        filesToMerge.push(...parts);
        i++;
      }
    }
  }

  const filesProvided = filesToMerge.length > 0;
  try {
    if (filesProvided) {
      filesToMerge.forEach((fileName) => {
        const fName = path.extname(fileName) === "" ? fileName + ext : fileName;
        const pathToEntrie = path.join(pathToParts, fName);
        pathesToFiles.push(pathToEntrie);
      });
    } else {
      const dir = await fs.opendir(pathToParts, { recursive: true });
      for await (const dirent of dir) {
        if (dirent.isFile() & (path.extname(dirent.name) === ext)) {
          const pathToEntrie = path.join(dirent.parentPath, dirent.name);
          pathesToFiles.push(pathToEntrie);
        }
      }
      if (pathesToFiles.length === 0) throw new Error();
      pathesToFiles.sort((a, b) => a.localeCompare(b));
    }

    await fs.writeFile(pathToWritingFile, "");
    for (const file of pathesToFiles) {
      const content = await fs.readFile(file, { encoding: "utf8" });
      await fs.writeFile(pathToWritingFile, content, { flag: "a" });
    }
  } catch (err) {
    throw new Error("FS operation failed");
  }
};

await merge();
