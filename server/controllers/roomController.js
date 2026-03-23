const Room = require('../models/Room');

const getRooms = async (req, res) => {
    const rooms = await Room.find({})
        .populate('department', 'name')
        .populate('programme', 'name')
        .populate('block', 'name');
    res.json(rooms);
};

const createRoom = async (req, res) => {
    const { department, programme, block, roomNumber } = req.body;
    const room = await Room.create({ department, programme, block, roomNumber });
    res.status(201).json(room);
};

const updateRoom = async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (room) {
        room.department = req.body.department || room.department;
        room.programme = req.body.programme || room.programme;
        room.block = req.body.block || room.block;
        room.roomNumber = req.body.roomNumber || room.roomNumber;
        const updated = await room.save();
        res.json(updated);
    } else {
        res.status(404); throw new Error('Room not found');
    }
};

const deleteRoom = async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (room) {
        await Room.deleteOne({ _id: req.params.id });
        res.json({ message: 'Room removed' });
    } else {
        res.status(404); throw new Error('Room not found');
    }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
