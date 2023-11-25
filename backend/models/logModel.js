const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    required: [true, "Level is required"],
    index: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  resourceId: {
    type: String,
    required: [true, "Resource ID is required"],
    index: true,
  },
  timestamp: {
    type: Date,
    required: [true, "Timestamp is required"],
    index: true,
  },
  traceId: {
    type: String,
    required: [true, "Trace ID is required"],
    index: true,
  },
  spanId: {
    type: String,
    required: [true, "Span ID is required"],
    index: true,
  },
  commit: {
    type: String,
    required: [true, "Commit is required"],
    index: true,
  },
  metadata: {
    parentResourceId: {
      type: String,
      required: [true, "Parent Resource ID is required"],
      index: true,
    },
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
