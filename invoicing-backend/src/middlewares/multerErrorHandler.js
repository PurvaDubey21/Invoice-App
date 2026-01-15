import multer from "multer";

export const multerErrorHandler = (err, req, res, next) => {
  // 🔥 Multer built-in errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "Image size should be less than 2 MB",
        code: "FILE_TOO_LARGE",
      });
    }

    return res.status(400).json({
      error: err.message,
    });
  }

  // 🔥 File filter errors
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      error: err.message,
      code: "INVALID_FILE_TYPE",
    });
  }

  next(err);
};
