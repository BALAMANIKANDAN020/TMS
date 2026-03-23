const Programme = require('../models/Programme');

const getProgrammes = async (req, res) => {
    const programmes = await Programme.find({}).populate('department', 'name');
    res.json(programmes);
};

const createProgramme = async (req, res) => {
    const { department, name, shortName } = req.body;
    const programme = await Programme.create({ department, name, shortName });
    res.status(201).json(programme);
};

const updateProgramme = async (req, res) => {
    const programme = await Programme.findById(req.params.id);
    if (programme) {
        programme.department = req.body.department || programme.department;
        programme.name = req.body.name || programme.name;
        programme.shortName = req.body.shortName || programme.shortName;
        const updated = await programme.save();
        res.json(updated);
    } else {
        res.status(404); throw new Error('Programme not found');
    }
};

const deleteProgramme = async (req, res) => {
    const programme = await Programme.findById(req.params.id);
    if (programme) {
        await Programme.deleteOne({ _id: req.params.id });
        res.json({ message: 'Programme removed' });
    } else {
        res.status(404); throw new Error('Programme not found');
    }
};

module.exports = { getProgrammes, createProgramme, updateProgramme, deleteProgramme };
