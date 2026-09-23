const errorHandler = (err, req, res, next) => {
  if (!err.statusCode || err.statusCode === 500) {
    console.error("🔥 Server Error:", err);
  }

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorDetails: err.stack ? err.stack.split("\n")[0] : undefined,
  });
};

export default errorHandler;