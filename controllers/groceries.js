const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

// GET ALL GROCERIES
const getMultiGroceries = async (req, res) => {
    try {
        const result = await mongodb.getDb().db().collection('groceries').find();
        const groceries = await result.toArray();
        res.status(200).json(groceries);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to get groceries' });
    }
};

// GET ONE GROCERY
const getOneGrocery = async (req, res) => {
    try {
        const groceryId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('groceries').find({ _id: groceryId });
        const groceries = await result.toArray();
        if (groceries.length === 0) {
            return res.status(404).json({ error: 'Grocery not found' });
        }
        res.status(200).json(groceries[0]);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid grocery ID' });
    }
};

// ADD GROCERY
const addGrocery = async (req, res) => {
    try {
        const grocery = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price
        };
        const response = await mongodb.getDb().db().collection('groceries').insertOne(grocery);
        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to create grocery' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid grocery data' });
    }
};

// UPDATE GROCERY
const updateGroceryById = async (req, res) => {
    try {
        const groceryId = new ObjectId(req.params.id);
        const grocery = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price
        };
        const response = await mongodb.getDb().db().collection('groceries').replaceOne({ _id: groceryId }, grocery);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Grocery updated' });
        } else {
            res.status(404).json({ error: 'Grocery not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid grocery ID or data' });
    }
};

// DELETE GROCERY
const deleteGrocery = async (req, res) => {
    try {
        const groceryId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('groceries').deleteOne({ _id: groceryId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Grocery deleted' });
        } else {
            res.status(404).json({ error: 'Grocery not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid grocery ID' });
    }
};

module.exports = {
    getMultiGroceries,
    getOneGrocery,
    addGrocery,
    updateGroceryById,
    deleteGrocery
};