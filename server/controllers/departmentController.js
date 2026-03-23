const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private/Admin
const getDepartments = async (req, res) => {
    const departments = await Department.find({});
    res.json(departments);
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    const { name, shortName } = req.body;

    const departmentExists = await Department.findOne({ name });

    if (departmentExists) {
        res.status(400);
        throw new Error('Department already exists');
    }

    const department = await Department.create({
        name,
        shortName,
    });

    if (department) {
        res.status(201).json(department);
    } else {
        res.status(400);
        throw new Error('Invalid department data');
    }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (department) {
        department.name = req.body.name || department.name;
        department.shortName = req.body.shortName || department.shortName;

        const updatedDepartment = await department.save();
        res.json(updatedDepartment);
    } else {
        res.status(404);
        throw new Error('Department not found');
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (department) {
        await Department.deleteOne({ _id: req.params.id });
        res.json({ message: 'Department removed' });
    } else {
        res.status(404);
        throw new Error('Department not found');
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};
