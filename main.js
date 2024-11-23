import http from "http";
import { writeLog } from "./utils/fs_logger.js";
import dotenv from "dotenv";
import { connect } from "./db/index.js";
import { requestHandler } from "./handlers/index.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();
const PORT = 3000;

//Database connection
connect(process.env.MONGO_URI, process.env.DATABASE_NAME);

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
