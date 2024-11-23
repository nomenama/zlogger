import { writeLog } from "../utils/fs_logger.js";

export const errorMiddleware = (err, req, res) => {
    writeLog(err, "error");
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
        JSON.stringify({ status: "error", message: "Internal Server Error" })
    );
};
