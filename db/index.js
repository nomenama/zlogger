import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { writeLog } from "../utils/fs_logger.js";

dotenv.config();

// Environment variable validation
if (!process.env.MONGO_URI || !process.env.DATABASE_NAME) {
    writeLog("MongoDB URI or database name is missing.", "error");
    process.exit(1);
}

export const COLLECTION_NAME =
    process.env.NODE_ENV === "development" ? "test_logs" : "prod_logs";

export let db;

export const connect = async (MONGO_URI, DATABASE_NAME) => {
    try {
        const client = await MongoClient.connect(MONGO_URI);
        db = client.db(DATABASE_NAME);
        writeLog(`Connected to MongoDB database: ${DATABASE_NAME}`);
        console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);
    } catch (err) {
        writeLog(err, "error");
        process.exit(1);
    }
};
