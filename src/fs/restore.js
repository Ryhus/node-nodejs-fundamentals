import fs from "node:fs/promises";
import path from "node:path";

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored

  const restoredWorkspacePath = "./home/user/workspace_restored";
  const pathToSnapshot = "./home/user/workspace/snapshot.json";

  async function directoryExists(path) {
    try {
      const stat = await fs.stat(path);
      return stat.isDirectory();
    } catch (err) {
      return false;
    }
  }

  const exists = await directoryExists(restoredWorkspacePath);

  try {
    if (!exists) {
      const contents = await fs.readFile(pathToSnapshot, { encoding: "utf-8" });
      const snapshot = JSON.parse(contents);
      const dirs = snapshot.entries.filter((e) => e.type === "directory");
      const files = snapshot.entries.filter((e) => e.type === "file");

      await Promise.all(
        dirs.map((dir) =>
          fs.mkdir(path.join(restoredWorkspacePath, dir.path), {
            recursive: true,
          }),
        ),
      );

      await Promise.all(
        files.map((file) => {
          const fullPath = path.join(restoredWorkspacePath, file.path);
          return fs.writeFile(fullPath, Buffer.from(file.content, "base64"));
        }),
      );
    } else {
      throw new Error();
    }
  } catch (err) {
    throw new Error("FS operation failed");
  }
};

await restore();
