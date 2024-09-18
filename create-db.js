import { Worker } from "worker_threads";
import { availableParallelism } from "os";
import { fileURLToPath } from "url";
import { join } from "path";
import { client } from "./db-config.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const NUM_DOCS = 1_000_000;
const BATCH_SIZE = 2000;
const NUM_CPUS = availableParallelism();

async function createDB() {
  try {
    const batchesPerWorker = Math.ceil(NUM_DOCS / (BATCH_SIZE * NUM_CPUS));
    const workers = [];

    for (let i = 0; i < NUM_CPUS; i++) {
      const worker = new Worker(join(__dirname, "creational-worker.js"), {
        workerData: {
          batchSize: BATCH_SIZE,
          startBatch: i * batchesPerWorker,
          endBatch: (i + 1) * batchesPerWorker,
        },
      });

      worker.on("message", console.log);

      worker.on("exit", () => {
        workers.splice(workers.indexOf(worker), 1);

        if (worker.length === 0) {
          client.close();
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

createDB();
