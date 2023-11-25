const multer = require("multer");
const path = require("path");
const fs = require("fs");

// For KYC
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the path name
    const pathName = path.resolve(process.cwd(), "../../files/");

    // Create folder for the uploads if it do not exist
    if (!fs.existsSync(pathName)) {
      fs.mkdirSync(pathName, { recursive: true });
    }

    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    cb(null, "logs_" + file.originalname); // Set file name
  },
});

// Check if file is csv only
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file", false);
  }
};

const upload = multer({ storage: storage, fileFilter: csvFilter });

// Export the upload

module.exports = {
  upload,
};
