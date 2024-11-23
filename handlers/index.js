import { writeLog } from "../utils/fs_logger.js";
import { COLLECTION_NAME, db } from "../db/index.js";
import { validateEntry } from "../validations/post.js";

const handlePostRequest = async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1e6) req.connection.destroy(); // Handle too large payloads
    });

    req.on("end", async () => {
        try {
            const logEntry = JSON.parse(body);
            validateEntry(logEntry);

            // Insert into MongoDB
            const result = await db
                .collection(COLLECTION_NAME)
                .insertOne(logEntry);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ status: "success", id: result.insertedId })
            );
        } catch (err) {
            writeLog(err, "error");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "error", message: err.message }));
        }
    });

    req.on("error", (err) => {
        writeLog(err, "error");
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    });
};

const handleGetRequest = async (req, res) => {
    const urlParams = new URLSearchParams(req.url.split("?")[1]);
    const clientFilter = urlParams.get("client");

    const clientIp = req.connection.remoteAddress || req.socket.remoteAddress;
    writeLog(
        `${clientIp} is trying to access the ${
            clientFilter ? clientFilter : ""
        } logs`,
        "warning"
    );

    if (!clientFilter) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
            JSON.stringify({ status: "error", message: "client is needed" })
        );
    }

    try {
        // Query logs based on the client filter
        const logs = await db
            .collection(COLLECTION_NAME)
            .find({ client: clientFilter })
            .toArray();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success", data: logs }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};

export const requestHandler = async (req, res) => {
    if (req.url.startsWith("/log")) {
        switch (req.method) {
            case "POST":
                handlePostRequest(req, res);
                break;
            case "GET":
                handleGetRequest(req, res);
                break;
            default:
                res.writeHead(405, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        status: "error",
                        message: "Method Not Allowed",
                    })
                );
                break;
        }
    } else {
        // Handle 404 for unsupported routes
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({ status: "error", message: "Route not found" })
        );
    }
};
