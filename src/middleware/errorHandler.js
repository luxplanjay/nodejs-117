import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message || err.name,
    });
    return;
  }

  console.log("Error Middleware:", err.message);
  res.status(500).json({
    error: err.message,
  });
};
