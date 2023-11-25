const { CustomAPIError } = require("../errors/allErr");
const Log = require("../models/logModel");

async function processLogsInBatches(logsData, batchSize) {
  try {
    // Slice the array in batch sizes and send them for processing
    for (let i = 0; i < logsData.length; i += batchSize) {
      const batch = logsData.slice(i, i + batchSize);
      await processLogs(batch);
      console.log(`Batch of ${batch.length} logs processed successfully`);
    }
  } catch (error) {
    throw new CustomAPIError("Error processing logs in batches");
  }
}

// Processing of logs
async function processLogs(logs) {
  try {
    await Log.insertMany(logs);
  } catch (error) {
    throw new CustomAPIError("Error processing logs");
  }
}

module.exports = {
  processLogsInBatches,
};
