const router = require("express").Router();

const { addlogs, addLogsUsingFile } = require("../controllers/logController");
const { upload } = require("../utils/fileUpload/upload");

router.route("/").post(addlogs);

router.route("/file").post(upload.single("Logs_file"), addLogsUsingFile);

module.exports = router;
