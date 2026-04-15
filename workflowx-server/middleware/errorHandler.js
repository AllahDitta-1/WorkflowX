export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value. This already exists.",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Resource not found" });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};