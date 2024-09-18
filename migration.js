import { availableParallelism } from "os";
import { Worker } from "worker_threads";
import { client, productsCollection } from "./db-config.js";
import { fileURLToPath } from "url";
import { join } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const NUM_CPUS = availableParallelism();
const BATCH_SIZE = 2000;

async function runMigration() {
  try {
    const totalDocs = await productsCollection.countDocuments();
    const batchesPerWorker = Math.ceil(totalDocs / (BATCH_SIZE * NUM_CPUS));
    const workers = [];

    for (let i = 0; i < NUM_CPUS; i++) {
      const worker = new Worker(join(__dirname, "migration-worker.js"), {
        workerData: {
          batchSize: BATCH_SIZE,
          startBatch: i * batchesPerWorker,
          endBatch: (i + 1) * batchesPerWorker,
        },
      });

      worker.on("message", (message) => {
        console.log(message);
      });

      worker.on("exit", () => {
        workers.splice(workers.indexOf(worker), 1);
        if (workers.length === 0) {
          client.close();
        }
      });

      workers.push(worker);
    }
  } catch (err) {
    console.error(err);
  }
}

runMigration();
