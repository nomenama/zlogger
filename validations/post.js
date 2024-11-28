const LOG_CONTENT = ["level", "client", "service", "message"];
const LEVEL = ["info", "warning", "error", "fatal"];

export const validateEntry = (logEntry) => {
    const missingFields = LOG_CONTENT.filter((field) => !(field in logEntry));
    const invalidLevel = !LEVEL.includes(logEntry.level);
    const emptyFields = LOG_CONTENT.filter((field) => {
        return logEntry[field] === "" || logEntry[field] == null; // Check for empty or null fields
    });

    // Check for missing fields
    if (missingFields.length > 0) {
        throw new Error(
            `Missing required field(s): ${missingFields.join(", ")}`
        );
    }

    // Check for invalid level
    if (invalidLevel) {
        throw new Error(
            `Invalid value for "level". Must be one of: ${LEVEL.join(", ")}`
        );
    }

    // Check for empty fields
    if (emptyFields.length > 0) {
        throw new Error(`Field(s) cannot be empty: ${emptyFields.join(", ")}`);
    }
};
