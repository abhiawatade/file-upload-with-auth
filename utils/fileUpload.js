const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "content");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000 * 100 },
  fileFilter: (req, res, cb) => {
    const fileTypes = /jpg|png|mp4|<gif /;
    const mimeType = fileTypes.test(file.mimeType);
    const extName = fileTypes.text(path.extname(file.originalname));

    if (mimeType && extName) {
      cb(null, true);

      cb("Only images are allowed");
    }
  },
}).single("content");

module.exports = upload;
