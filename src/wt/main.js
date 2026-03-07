import { availableParallelism } from "node:os";
import { readFile } from "node:fs/promises";
import { Worker } from "node:worker_threads";
import path from "node:path";

const main = async () => {
  // Write your code here
  // Read data.json containing array of numbers
  // Split into N chunks (N = CPU cores)
  // Create N workers, send one chunk to each
  // Collect sorted chunks
  // Merge using k-way merge algorithm
  // Log final sorted array

  const pathToData = "./src/wt/data.json";
  const pathToWorker = path.resolve("src/wt/worker.js");
  const workerNumbers = Math.max(1, availableParallelism() - 1);

  const workers = [];

  const dataText = await readFile(pathToData);
  const arrayToSort = JSON.parse(dataText).array;

  const chunkSize = Math.ceil(arrayToSort.length / workerNumbers);

  for (let i = 0; i < workerNumbers; i++) {
    workers.push(new Worker(pathToWorker));
  }

  const promises = workers.map((worker, index) => {
    const chunk = arrayToSort.slice(index * chunkSize, (index + 1) * chunkSize);

    return new Promise((resolve) => {
      worker.on("message", resolve);
      worker.postMessage(chunk);
    });
  });

  const sortedChunks = await Promise.all(promises);

  workers.forEach((w) => w.terminate());

  function kWayMergeSimple(arrays) {
    const result = [];
    const pointers = new Array(arrays.length).fill(0);

    while (true) {
      let min = Infinity;
      let minIndex = -1;

      for (let i = 0; i < arrays.length; i++) {
        const ptr = pointers[i];

        if (ptr < arrays[i].length && arrays[i][ptr] < min) {
          min = arrays[i][ptr];
          minIndex = i;
        }
      }

      if (minIndex === -1) break;

      result.push(min);
      pointers[minIndex]++;
    }

    return result;
  }

  console.log(kWayMergeSimple(sortedChunks));
};

await main();
