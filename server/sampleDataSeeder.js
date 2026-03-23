const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Department = require('./models/Department');
const Programme = require('./models/Programme');
const Block = require('./models/Block');
const Room = require('./models/Room');
const Role = require('./models/Role');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedSampleData = async () => {
    try {
        // Clear existing data to avoid duplicates (optional, but requested 5 entries)
        // Keep SuperAdmin if email is same, or just clear and re-seed.
        // Let's clear everything except Roles to stay consistent.
        await Department.deleteMany();
        await Programme.deleteMany();
        await Block.deleteMany();
        await Room.deleteMany();
        // Remove everyone except the admin we created in seeder.js
        await User.deleteMany({ email: { $ne: 'admin@tms.com' } });

        console.log('Cleaning up collections...');

        // 1. Departments
        const depts = [
            { name: 'Computer Science', shortName: 'CSE' },
            { name: 'Electrical Engineering', shortName: 'EEE' },
            { name: 'Mechanical Engineering', shortName: 'MECH' },
            { name: 'Business Administration', shortName: 'BBA' },
            { name: 'Life Sciences', shortName: 'BIO' }
        ];
        const createdDepts = await Department.insertMany(depts);
        console.log('5 Departments Seeded');

        // 2. Realistic Programmes
        const deptProgs = {
            'Computer Science': [
                { name: 'B.Tech Information Technology', shortName: 'BTECH-IT' },
                { name: 'B.E. Computer Science & Engg', shortName: 'BE-CSE' },
                { name: 'M.E. Software Engineering', shortName: 'ME-SE' },
                { name: 'B.Sc Data Science', shortName: 'BSC-DS' },
                { name: 'Artificial Intelligence & ML', shortName: 'AI-ML' }
            ],
            'Electrical Engineering': [
                { name: 'B.E. Electrical & Electronics', shortName: 'BE-EEE' },
                { name: 'B.E. Electronics & Communication', shortName: 'BE-ECE' },
                { name: 'M.E. Power Systems', shortName: 'ME-PS' },
                { name: 'B.E. Instrumentation', shortName: 'BE-EIE' },
                { name: 'Robotics & Automation', shortName: 'ROBO' }
            ],
            'Mechanical Engineering': [
                { name: 'B.E. Mechanical Engineering', shortName: 'BE-MECH' },
                { name: 'B.E. Automobile Engineering', shortName: 'BE-AUTO' },
                { name: 'M.E. Manufacturing Engg', shortName: 'ME-MFG' },
                { name: 'B.E. Mechatronics', shortName: 'MECH-TRON' },
                { name: 'B.E. Production Engineering', shortName: 'BE-PROD' }
            ],
            'Business Administration': [
                { name: 'MBA Marketing Management', shortName: 'MBA-MKT' },
                { name: 'MBA Financial Services', shortName: 'MBA-FIN' },
                { name: 'MBA Operations Management', shortName: 'MBA-OPS' },
                { name: 'BBA Digital Marketing', shortName: 'BBA-DIGI' },
                { name: 'BBA Global Business', shortName: 'BBA-INT' }
            ],
            'Life Sciences': [
                { name: 'B.Sc Medical Biotechnology', shortName: 'BSC-MBT' },
                { name: 'M.Sc Applied Microbiology', shortName: 'MSC-AMB' },
                { name: 'B.Sc Bioinformatics', shortName: 'BSC-BI' },
                { name: 'B.Sc Food Technology', shortName: 'BSC-FT' },
                { name: 'B.Sc Environmental Science', shortName: 'BSC-ES' }
            ]
        };

        const progs = [];
        createdDepts.forEach(dept => {
            const specificProgs = deptProgs[dept.name] || [];
            specificProgs.forEach(p => {
                progs.push({
                    name: p.name,
                    shortName: p.shortName,
                    department: dept._id
                });
            });
        });
        const createdProgs = await Programme.insertMany(progs);
        console.log(`Seeded ${createdProgs.length} Programmes (5 per dept)`);

        // 3. Blocks
        const blocks = createdProgs.map((prog, index) => ({
            name: `${prog.shortName} Block`,
            department: prog.department,
            programme: prog._id
        }));
        const createdBlocks = await Block.insertMany(blocks);
        console.log(`Seeded ${createdBlocks.length} Blocks`);

        // 4. Rooms (125 total: 5 per block across 25 blocks)
        const rooms = [];
        createdBlocks.forEach((block) => {
            for (let i = 1; i <= 5; i++) {
                rooms.push({
                    roomNumber: `${block.name.charAt(0)}${100 + i + Math.floor(Math.random() * 50)}`,
                    department: block.department,
                    programme: block.programme,
                    block: block._id
                });
            }
        });
        await Room.insertMany(rooms);
        console.log(`Seeded ${rooms.length} Rooms (125 total)`);

        // 5. Users (Staff and Students)
        const salt = await bcrypt.genSalt(10);
        const hashedUserPassword = await bcrypt.hash('password123', salt);

        const sampleUsers = [
            {
                name: 'John Technician',
                email: 'john@tms.com',
                password: hashedUserPassword,
                phoneNumber: '9876543210',
                role: 'Technician',
                department: createdDepts[0]._id,
                programme: createdProgs[0]._id
            },
            {
                name: 'Sarah Network',
                email: 'sarah@tms.com',
                password: hashedUserPassword,
                phoneNumber: '9876543211',
                role: 'Networking Staff',
                department: createdDepts[1]._id,
                programme: createdProgs[1]._id
            },
            {
                name: 'Bob User',
                email: 'bob@tms.com',
                password: hashedUserPassword,
                phoneNumber: '9876543212',
                role: 'User',
                department: createdDepts[2]._id,
                programme: createdProgs[2]._id
            },
            {
                name: 'Mike Plumber',
                email: 'mike@tms.com',
                password: hashedUserPassword,
                phoneNumber: '9876543213',
                role: 'Plumber',
                department: createdDepts[3]._id,
                programme: createdProgs[3]._id
            },
            {
                name: 'Lisa Electrician',
                email: 'lisa@tms.com',
                password: hashedUserPassword,
                phoneNumber: '9876543214',
                role: 'Electrician',
                department: createdDepts[4]._id,
                programme: createdProgs[4]._id
            }
        ];
        await User.insertMany(sampleUsers);
        console.log('5 Sample Users Seeded');

        console.log('All sample data successfully seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedSampleData();
