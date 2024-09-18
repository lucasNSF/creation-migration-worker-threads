import { workerData, parentPort } from "worker_threads";
import { client, productsCollection } from "./db-config.js";
import { createProduct } from "./create-product.js";

async function createDocProduct() {
  try {
    const { batchSize, startBatch, endBatch } = workerData;

    for (let batch = startBatch; batch < endBatch; batch++) {
      const products = [];

      for (let i = 0; i < batchSize; i++) {
        const product = createProduct();
        products.push(product);
      }

      await productsCollection.insertMany(products);

      parentPort.postMessage({
        statusbar: 0,
        message: `Finished batch ${batch + 1}.`,
      });
    }

    parentPort.postMessage({ statusbar: 0, message: `All batches finished!` });
  } catch (err) {
    parentPort.postMessage({ status: 1, error: err });
  } finally {
    client.close();
  }
}

createDocProduct();
