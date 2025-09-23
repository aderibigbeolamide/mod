import Multer from "multer";
import { logger } from "../../../config/logger.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = Multer.diskStorage({
  destination: path.resolve(__dirname, "../../../../resources/uploads/"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.filename + "-" + uniqueSuffix);
  },
});

const multerErrorHandler = (err, next) => {
  if (err instanceof Multer.MulterError) {
    logger.error("Multer upload error is", err);
  } else if (err) {
    // An unknown error occurred when uploading.
    logger.error("Err when uploading is", err);
  }
  // next();
};

export const uploadFileMiddleWare = Multer({
  storage,
  limits: { fileSize: 6_000_000 },
});

export const uploadLargeFileMiddleWare = Multer({
  storage,
  limits: { fileSize: 20_000_000 },
});
