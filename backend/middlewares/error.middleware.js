const errorHandler = (err, req, res, next) => {
  // Only log 500 errors to the console to prevent log spam from user errors 400
  if (!err.statusCode || err.statusCode === 500) {
    console.error("🔥 Server Error:", err);
  }

  const statusCode = err.statusCode || 500;
  

  const message = (statusCode === 500 && process.env.NODE_ENV === "production") 
    ? "Internal Server Error" 
    : (err.message || "Internal Server Error");

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;    