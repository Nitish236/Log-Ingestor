const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/allErr");

const Log = require("../models/logModel");

/* ---------------------------------------------------------------------------------------------------------- */

//                       Function for Filtering

const filterLogs = async (req, res) => {
  console.log("I am serving");
  // Get all the filters
  const filters = req.body;

  // For pagination
  let { page = 1, limit = 10 } = req.query; // Fallback values of 1 for page and 10 for limit
  page = parseInt(page);
  limit = parseInt(limit);

  const {
    level,
    message,
    resourceId,
    timestampStart,
    timestampEnd,
    traceId,
    spanId,
    commit,
    parentResourceId,
  } = filters;

  // Match stages
  const matchStages = [];

  // Based on filters if present add them in the Pipeline
  if (level) matchStages.push({ level });
  if (resourceId) matchStages.push({ resourceId });
  if (traceId) matchStages.push({ traceId });
  if (spanId) matchStages.push({ spanId });
  if (commit) matchStages.push({ commit });
  if (parentResourceId)
    matchStages.push({ "metadata.parentResourceId": parentResourceId });

  if (timestampStart || timestampEnd) {
    const timestampMatch = {};
    if (timestampStart) timestampMatch.$gte = new Date(timestampStart);
    if (timestampEnd) timestampMatch.$lte = new Date(timestampEnd);
    matchStages.push({ timestamp: timestampMatch });
  }

  const aggregationPipeline = []; // Pipeline

  // Using Search index for message
  if (message)
    aggregationPipeline.push({
      $search: {
        index: "message_index",
        text: {
          query: message,
          path: "message",
        },
      },
    });

  // Add all the match stages
  if (matchStages.length > 0) {
    aggregationPipeline.push({ $match: { $and: matchStages } });
  }

  // Docs to skip
  const skip = (page - 1) * limit;

  // Sub aggregration query
  aggregationPipeline.push({
    $facet: {
      logs: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "total" }],
    },
  });

  const [result] = await Log.aggregate(aggregationPipeline);

  // If no logs found according based on current filters
  if (!result || !result.logs.length) {
    res.status(StatusCodes.OK).json({
      msg: "No Logs data found",
      logs: [],
      totalPages: 1,
      currentPage: 1,
    });
  } else {
    const { logs, totalCount } = result;
    const totalPages = Math.ceil(totalCount[0]?.total / limit); // Total pages based on current filters

    // Send Response
    res.status(StatusCodes.OK).json({
      msg: "Logs data fetched successfully",
      logs,
      totalPages,
      currentPage: page,
    });
  }
};

module.exports = {
  filterLogs,
};
