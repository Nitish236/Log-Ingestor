require("dotenv").config();

const { CustomAPIError } = require("../errors/allErr");
const { StatusCodes } = require("http-status-codes");

const { processLogsInBatches } = require("../utils/logProcessor");

const fs = require("fs").promises;
const csvParser = require("csv-parser");
const { Readable } = require("stream");

/* ---------------------------------------------------------------------------------------------------------------- */

//                            Function to add Logs

const addlogs = async (req, res) => {
  const logsData = req.body.logs; // An array of logs
  const batchSize = parseInt(process.env.PROCESSING_BATCH_SIZE) || 150; // Batch size (default)

  try {
    await processLogsInBatches(logsData, batchSize);
  } catch (error) {
    throw new CustomAPIError("Error ingesting logs");
  }

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Logs received and processing initiated" });
};

//                            Function to Add Logs using file

const addLogsUsingFile = async (req, res) => {
  try {
    let i = 1;
    const filePath = req.file.path;
    const batchSize = parseInt(process.env.INGEST_BATCH_SIZE) || 300;
    const processing_batchSize =
      parseInt(process.env.PROCESSING_BATCH_SIZE) || 150;
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
        processLogsInBatches([...logs], processing_batchSize);
        console.log(`Request ${i++} to Ingest a batch of ${batchSize} logs`);
        logs.length = 0;
      }
    });

    parser.on("end", () => {
      // After reaching the end of the file, send remaining logs (if any)
      if (logs.length > 0) {
        processLogsInBatches([...logs], processing_batchSize);
      }
      console.log(`Request ${i++} to Ingest a batch of ${logs.length} logs`);
      console.log("\nLogs Ingestion has ended -- \n");

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting file : " + err.message);
        }
      });
    });

    // Send response
    res.status(StatusCodes.ACCEPTED).json({
      msg: "Logs Ingested successfully",
    });
  } catch (error) {
    throw new CustomAPIError(`Error ingesting logs : ${error.message}\n`);
  }
};

module.exports = {
  addlogs,
  addLogsUsingFile,
};
