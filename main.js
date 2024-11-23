import http from "http";
import { MongoClient } from "mongodb";
import { writeLog } from "./utils/fs_logger.js";
import dotenv from "dotenv";
import { connect, COLLECTION_NAME, db } from "./db/index.js";
import { requestHandler } from "./handlers/index.js";

dotenv.config();
const PORT = 3000;

//Database connection
connect(process.env.MONGO_URI, process.env.DATABASE_NAME);

// Error handling middleware
const errorMiddleware = (err, req, res) => {
    writeLog(err, "error");
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
        JSON.stringify({ status: "error", message: "Internal Server Error" })
    );
};

// Server creation
const server = http.createServer((req, res) => {
    try {
        requestHandler(req, res);
    } catch (err) {
        errorMiddleware(err, req, res);
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Logs server is running on http://localhost:${PORT}`);
    writeLog(`Logs server is running on http://localhost:${PORT}`);
});
