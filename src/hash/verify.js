import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { error } from "node:console";

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL

  const pathTofilesDirectory = "./src/hash/files";
  const pathToChecksums = "./src/hash/checksums.json";

  async function hashFile(file, pathTofilesDirectory) {
    const hash = createHash("sha256");
    const pathToFile = path.join(pathTofilesDirectory, file);

    await pipeline(createReadStream(pathToFile), hash);

    return [file, hash.digest("hex")];
  }

  const [checksumsText, files] = await Promise.all([
    readFile(pathToChecksums, {
      encoding: "utf-8",
    }),
    readdir(pathTofilesDirectory),
  ]).catch(() => {
    throw new Error("FS operation failed");
  });

  const checksumsObject = JSON.parse(checksumsText);

  const hashes = await Promise.all(
    files.map((file) => hashFile(file, pathTofilesDirectory)),
  );

  hashes.forEach((el) => {
    const key = el[0];
    if (checksumsObject[key] === el[1]) {
      console.log(`${key} - OK`);
    } else {
      console.log(`${key} - FALSE`);
    }
  });
};

await verify();
