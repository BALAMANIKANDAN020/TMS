const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Role.deleteMany();
        await User.deleteMany();

        // Roles
        const roles = [
            { name: 'SuperAdmin' },
            { name: 'User' },
            { name: 'Networking Staff' },
            { name: 'Plumber' },
            { name: 'Electrician' },
            { name: 'Software Developer' },
            { name: 'Technician' }
        ];

        await Role.insertMany(roles);
        console.log('Roles Seeded!');

        // SuperAdmin User
        await User.create({
            name: 'Super Admin',
            email: 'admin@tms.com',
            password: 'admin123', // Will be hashed by pre-save hook
            phoneNumber: '1234567890',
            role: 'SuperAdmin',
        });

        // Regular User
        await User.create({
            name: 'Regular User',
            email: 'user@tms.com',
            password: 'user123', // Will be hashed by pre-save hook
            phoneNumber: '9876543210',
            role: 'User',
        });

        console.log('SuperAdmin and Regular User Seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
