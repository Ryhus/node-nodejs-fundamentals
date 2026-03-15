import { createBrotliDecompress } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";

const decompressDir = async () => {
  // Write your code here
  // Read archive.br from workspace/compressed/
  // Decompress and extract to workspace/decompressed/
  // Use Streams API

  const archivePath = "./home/user/workspace/compressed/archive.br";
  const outputDir = "./home/user/workspace/decompressed";
  const compressedPath = "./home/user/workspace/compressed";

  try {
    await access(archivePath);
    await access(compressedPath);
  } catch {
    throw new Error("FS operation failed");
  }

  await mkdir(outputDir, { recursive: true });

  const brotli = createBrotliDecompress();
  const readStream = createReadStream(archivePath);

  let buffer = Buffer.alloc(0);

  readStream.pipe(brotli);

  brotli.on("data", async (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
  });

  await new Promise((resolve) => {
    brotli.on("end", resolve);
  });

  let offset = 0;

  while (offset < buffer.length) {
    const pathLen = buffer.readUInt32BE(offset);
    offset += 4;

    const filePath = buffer.subarray(offset, offset + pathLen).toString();

    offset += pathLen;

    const fileSize = Number(buffer.readBigUInt64BE(offset));

    offset += 8;

    const fileContent = buffer.subarray(offset, offset + fileSize);

    offset += fileSize;

    const fullPath = path.join(outputDir, filePath);

    await mkdir(path.dirname(fullPath), {
      recursive: true,
    });

    createWriteStream(fullPath).write(fileContent);
  }
};

await decompressDir();
