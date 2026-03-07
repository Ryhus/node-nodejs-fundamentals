import { createBrotliCompress } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { readdir, access, stat, mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const compressDir = async () => {
  // Write your code here
  // Read all files from workspace/toCompress/
  // Compress entire directory structure into archive.br
  // Save to workspace/compressed/
  // Use Streams API

  const pathToFiles = "./home/user/workspace/toCompress";
  const targetDir = "./home/user/workspace/compressed";

  try {
    await access(pathToFiles);
  } catch {
    throw new Error("FS operation failed");
  }

  const archivePath = path.join(targetDir, "archive.br");

  await mkdir(targetDir, { recursive: true });
  const files = await readdir(pathToFiles, { recursive: true });
  const fullPathes = files.map((file) => path.join(pathToFiles, file));

  const brotli = createBrotliCompress();
  const output = createWriteStream(archivePath);

  brotli.pipe(output);

  for (const file of fullPathes) {
    const st = await stat(file);

    const relativePath = path.relative(pathToFiles, file);
    const pathBuf = Buffer.from(relativePath);
    const pathLen = Buffer.alloc(4);
    pathLen.writeUInt32BE(pathBuf.length);

    const sizeBuf = Buffer.alloc(8);
    sizeBuf.writeBigUInt64BE(BigInt(st.size));

    brotli.write(pathLen);
    brotli.write(pathBuf);
    brotli.write(sizeBuf);

    await pipeline(createReadStream(file), brotli, { end: false });
  }

  brotli.end();
};

await compressDir();
