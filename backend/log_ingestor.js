require("dotenv").config();

const fs = require("fs").promises;
const axios = require("axios");
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const filePath = process.argv[2];
const serverURL = "http://localhost:3000/";

if (!filePath) {
  console.error("Please provide a path to the CSV file.");
  process.exit(1);
}

const batchAndSendLogs = async (logsBatch) => {
  try {
    await axios.post(serverURL, { logs: logsBatch });
  } catch (error) {
    console.error("Error ingesting logs:\n", error.message);
  }
};

const ingestLogs = async () => {
  try {
    let i = 1;
    const batchSize = parseInt(process.env.INGEST_BATCH_SIZE) || 300;
    const logs = [];

    const fileContent = await fs.readFile(filePath, "utf8");
    const readableStream = Readable.from(fileContent);

    const parser = readableStream.pipe(csvParser());

    console.log("\nLogs Ingestion is starting -- \n");

    parser.on("data", (row) => {
      const formattedLog = {
        level: row.level,
        message: row.message,
        resourceId: row.resourceId,
        timestamp: row.timestamp,
        traceId: row.traceId,
        spanId: row.spanId,
        commit: row.commit,
        metadata: {
          parentResourceId: row.parentResourceId,
        },
      };
      logs.push(formattedLog);

      if (logs.length === batchSize) {
        // When logs reach the batch size, send the batch and reset logs array
        batchAndSendLogs([...logs]);
        console.log(`Request ${i++} to Ingest a batch of ${batchSize} logs`);
        logs.length = 0;
      }
    });

    parser.on("end", () => {
      // After reaching the end of the file, send remaining logs (if any)
      if (logs.length > 0) {
        batchAndSendLogs([...logs]);
      }
      console.log(`Request ${i++} to Ingest a batch of ${logs.length} logs`);
      console.log("\nLogs Ingestion has ended -- \n");
    });
  } catch (error) {
    console.error(`Error ingesting logs : ${error.message}\n`);
  }
};

ingestLogs();
