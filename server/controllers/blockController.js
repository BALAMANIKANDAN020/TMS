const Block = require('../models/Block');

const getBlocks = async (req, res) => {
    const blocks = await Block.find({}).populate('department', 'name').populate('programme', 'name');
    res.json(blocks);
};

const createBlock = async (req, res) => {
    const { department, programme, name } = req.body;
    const block = await Block.create({ department, programme, name });
    res.status(201).json(block);
};

const updateBlock = async (req, res) => {
    const block = await Block.findById(req.params.id);
    if (block) {
        block.department = req.body.department || block.department;
        block.programme = req.body.programme || block.programme;
        block.name = req.body.name || block.name;
        const updated = await block.save();
        res.json(updated);
    } else {
        res.status(404); throw new Error('Block not found');
    }
};

const deleteBlock = async (req, res) => {
    const block = await Block.findById(req.params.id);
    if (block) {
        await Block.deleteOne({ _id: req.params.id });
        res.json({ message: 'Block removed' });
    } else {
        res.status(404); throw new Error('Block not found');
    }
};

module.exports = { getBlocks, createBlock, updateBlock, deleteBlock };
