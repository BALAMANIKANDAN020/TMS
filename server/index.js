const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// Home route
app.get("/", (req, res) => {
    res.send("TMS Backend Running Successfully");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/programmes", require("./routes/programmeRoutes"));
app.use("/api/blocks", require("./routes/blockRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

// Error handling
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production"
            ? null
            : err.stack,
    });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});