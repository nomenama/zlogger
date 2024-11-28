import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the logs folder path relative to the project root
const LOGS_DIR = path.join(__dirname, "../logs");
const ERROR_LOG_FILE = path.join(LOGS_DIR, "error.log");
const WARNING_LOG_FILE = path.join(LOGS_DIR, "warning.log");
const INFO_LOG_FILE = path.join(LOGS_DIR, "info.log");

// Ensure the "logs" directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Write log function
export const writeLog = (message, type = "info") => {
    if (process.env.NODE_ENV !== "production") {
        console.log(`[${type.toUpperCase()}] - ${message}`);
        return;
    }

    if (type !== "info" && type !== "error" && type !== "warning") {
        console.error(
            "Incorrect log type. It must be either 'info' or 'error' or 'warning'!"
        );
        return;
    }

    const timestamp = new Date().toISOString();
    const logType = type.toUpperCase();
    const logFile =
        type === "error"
            ? ERROR_LOG_FILE
            : type === "warning"
            ? WARNING_LOG_FILE
            : INFO_LOG_FILE;
    const formattedMessage = `[${timestamp}] [${logType}] ${
        type === "error" && message.stack ? message.stack : message
    }\n`;

    fs.appendFile(logFile, formattedMessage, (fsErr) => {
        if (fsErr) {
            console.error(`Failed to write to ${type} log:`, fsErr);
        }
    });
};
