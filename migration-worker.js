import { parentPort, workerData } from "worker_threads";
import {
  client,
  productsCollection,
  newProductsCollection,
} from "./db-config.js";

async function migrateData() {
  try {
    const { batchSize, startBatch, endBatch } = workerData;

    for (let batch = startBatch; batch < endBatch; batch++) {
      const skip = batch * batchSize;
      const docs = await productsCollection
        .find()
        .skip(skip)
        .limit(batchSize)
        .toArray();

      if (docs.length === 0) break;

      const updatedProducts = docs.map((doc) => {
        doc.seller = "lucasNSF";
        doc.price -= doc.price * 0.1;
        return doc;
      });

      await newProductsCollection.insertMany(updatedProducts);

      parentPort.postMessage({
        status: 0,
        message: `Finished batch ${batch + 1}.`,
      });
    }

    parentPort.postMessage({ status: 0, message: "Finished all batches!" });
  } catch (err) {
  } finally {
    client.close();
  }
}

migrateData();
