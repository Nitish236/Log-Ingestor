const { filterLogs } = require("../controllers/queryController");

const router = require("express").Router();

router.route("/query").post(filterLogs);

module.exports = router;
