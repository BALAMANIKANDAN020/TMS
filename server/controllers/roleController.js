const Role = require('../models/Role');

const getRoles = async (req, res) => {
    const roles = await Role.find({});
    res.json(roles);
};

const createRole = async (req, res) => {
    const { name } = req.body;
    const role = await Role.create({ name });
    res.status(201).json(role);
};

const updateRole = async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (role) {
        role.name = req.body.name || role.name;
        const updated = await role.save();
        res.json(updated);
    } else {
        res.status(404); throw new Error('Role not found');
    }
};

const deleteRole = async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (role) {
        await Role.deleteOne({ _id: req.params.id });
        res.json({ message: 'Role removed' });
    } else {
        res.status(404); throw new Error('Role not found');
    }
};

module.exports = { getRoles, createRole, updateRole, deleteRole };
