const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const Room = require('../models/Room');

// @desc    Raise a new complaint
// @route   POST /api/complaints
// @access  Private
const raiseComplaint = async (req, res) => {
    const { block, room, type, remarks, attachment, department, programme } = req.body;

    const complaint = await Complaint.create({
        user: req.user._id,
        department: department || req.user.department,
        programme,
        block,
        room,
        type,
        remarks,
        attachment,
    });

    if (complaint) {
        res.status(201).json(complaint);
    } else {
        res.status(400);
        throw new Error('Invalid complaint data');
    }
};

// @desc    Get all complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    let query = {};

    // RBAC Filtering
    if (req.user.role === 'SuperAdmin') {
        // SuperAdmin sees all
        query = {};
    } else if (['Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Technician'].includes(req.user.role)) {
        // Staff sees assigned or relevant to their role? 
        // Requirement says: "Complained Assigned Staff can view..."
        // For now, let's show all in their dept or assigned to them
        query = { $or: [{ assignedTo: req.user._id }, { department: req.user.department }] };
    } else {
        // Regular users see only their own
        query = { user: req.user._id };
    }

    const complaints = await Complaint.find(query)
        .populate('user', 'name email')
        .populate('department', 'name shortName')
        .populate('programme', 'name shortName')
        .populate('block', 'name')
        .populate('room', 'roomNumber')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 });

    res.json(complaints);
};

// @desc    Update complaint status/assignment
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        // SuperAdmin can assign
        if (req.user.role === 'SuperAdmin') {
            complaint.assignedTo = req.body.assignedTo || complaint.assignedTo;
            complaint.status = req.body.status || complaint.status;
            if (req.body.assignedTo) {
                complaint.assignedAt = Date.now();
                complaint.status = 'Assigned';
            }
        }
        // Assigned Staff can update status
        else if (complaint.assignedTo?.toString() === req.user._id.toString()) {
            complaint.status = req.body.status || complaint.status;
            if (req.body.status === 'Completed') {
                complaint.completedAt = Date.now();
            }
        }

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Invalid complaint ID' });
        }

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // RBAC: Only SuperAdmin or the User who raised it can delete
        const isOwner = complaint.user && complaint.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'SuperAdmin';

        if (isAdmin || isOwner) {
            await Complaint.deleteOne({ _id: id });
            return res.status(200).json({ message: 'Complaint removed' });
        } else {
            return res.status(403).json({ message: 'You do not have permission to delete this complaint' });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Server error during deletion',
            error: error.message
        });
    }
};

module.exports = { raiseComplaint, getComplaints, updateComplaint, deleteComplaint };
