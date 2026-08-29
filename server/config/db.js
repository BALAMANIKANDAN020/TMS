const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers((process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8").split(","));

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;