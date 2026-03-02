import fs from "node:fs/promises";
import path from "node:path";

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
  const pathToWorkspace = "./home/user/workspace";
  const rootPath = path.normalize(pathToWorkspace);

  const entries = [];
  const snapshot = { rootPath: rootPath };

  try {
    const dir = await fs.opendir(pathToWorkspace, { recursive: true });

    for await (const dirent of dir) {
      const pathToEntrie = path.join(dirent.parentPath, dirent.name);

      const relativePath = path.relative(pathToWorkspace, pathToEntrie);
      const type = dirent.isDirectory() ? "directory" : "file";

      const entrie = { path: relativePath, type: type };

      if (type === "file") {
        const stat = await fs.stat(pathToEntrie);
        const data = await fs.readFile(pathToEntrie, { encoding: "base64" });

        entrie.size = stat.size;
        entrie.content = data;
      }

      entries.push(entrie);
    }

    snapshot.entries = entries;

    await fs.writeFile(
      path.join(pathToWorkspace, "snapshot.json"),
      JSON.stringify(snapshot, null, 2),
    );
  } catch (err) {
    throw new Error("FS operation failed");
  }
};

await snapshot();
