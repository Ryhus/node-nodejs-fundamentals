import { parentPort, isMainThread, Worker } from "worker_threads";

// Receive array from main thread
// Sort in ascending order
// Send back to main thread

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  worker.on("message", (msg) => console.log("Sorted Array: ", msg));

  const arrayToSort = [7, 2, 3, 8, 10];
  worker.postMessage(arrayToSort);
} else {
  parentPort.on("message", (data) => {
    const sortedArray = data.sort((a, b) => a - b);
    parentPort.postMessage(sortedArray);
  });
}
