import { MongoClient } from "mongodb";

const URI = "mongodb://127.0.0.1/";
const DATABASE_NAME = "shop";
const SOURCE_COLLECTION = "products";
const TARGET_COLLECTION = "new_products";

const client = new MongoClient(URI);
const database = client.db(DATABASE_NAME);
const productsCollection = database.collection(SOURCE_COLLECTION);
const newProductsCollection = database.collection(TARGET_COLLECTION);

export { client, productsCollection, newProductsCollection };
