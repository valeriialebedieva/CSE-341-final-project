const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

const validateGroceryData = (groceryData) => {
    const errors = [];
    
    if (!groceryData.name || typeof groceryData.name !== 'string' || groceryData.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }
    
    if (groceryData.quantity === undefined || groceryData.quantity === null) {
        errors.push('Quantity is required');
    } else if (typeof groceryData.quantity !== 'number' || groceryData.quantity < 0) {
        errors.push('Quantity must be a non-negative number');
    }
    
    if (groceryData.price === undefined || groceryData.price === null) {
        errors.push('Price is required');
    } else if (typeof groceryData.price !== 'number' || groceryData.price < 0) {
        errors.push('Price must be a non-negative number');
    }
    
    return errors;
};

const validateObjectId = (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid grocery ID format');
    }
    return new ObjectId(id);
};

// GET ALL GROCERIES
const getMultiGroceries = async (req, res) => {
    try {
        
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('groceries').find();
        const groceries = await result.toArray();
        res.status(200).json(groceries);
    } catch (err) {
        console.error('Error in getMultiGroceries:', err);
        res.status(500).json({ 
            error: 'Failed to retrieve groceries',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// GET ONE GROCERY
const getOneGrocery = async (req, res) => {
    try {
        
        if (!req.params.id) {
            return res.status(400).json({ error: 'Grocery ID is required' });
        }

        const groceryId = validateObjectId(req.params.id);
        
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('groceries').find({ _id: groceryId });
        const groceries = await result.toArray();
        
        if (groceries.length === 0) {
            return res.status(404).json({ error: 'Grocery not found' });
        }
        
        res.status(200).json(groceries[0]);
    } catch (err) {
        console.error('Error in getOneGrocery:', err);
        if (err.message === 'Invalid grocery ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to retrieve grocery',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// ADD GROCERY
const addGrocery = async (req, res) => {
    try {
       
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateGroceryData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const grocery = {
            name: req.body.name.trim(),
            quantity: Number(req.body.quantity),
            price: Number(req.body.price),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('groceries').insertOne(grocery);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                id: response.insertedId,
                message: 'Grocery item created successfully'
            });
        } else {
            res.status(500).json({ error: 'Failed to create grocery item' });
        }
    } catch (err) {
        console.error('Error in addGrocery:', err);
        res.status(500).json({ 
            error: 'Failed to create grocery item',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// UPDATE GROCERY
const updateGroceryById = async (req, res) => {
    try {
    
        if (!req.params.id) {
            return res.status(400).json({ error: 'Grocery ID is required' });
        }

        const groceryId = validateObjectId(req.params.id);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateGroceryData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const grocery = {
            name: req.body.name.trim(),
            quantity: Number(req.body.quantity),
            price: Number(req.body.price),
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('groceries').replaceOne({ _id: groceryId }, grocery);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Grocery not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Grocery item updated successfully' });
        } else {
            res.status(200).json({ message: 'Grocery data unchanged' });
        }
    } catch (err) {
        console.error('Error in updateGroceryById:', err);
        if (err.message === 'Invalid grocery ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to update grocery item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// DELETE GROCERY
const deleteGrocery = async (req, res) => {
    try {
      
        if (!req.params.id) {
            return res.status(400).json({ error: 'Grocery ID is required' });
        }

        const groceryId = validateObjectId(req.params.id);

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const response = await mongodb.getDb().db().collection('groceries').deleteOne({ _id: groceryId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Grocery item deleted successfully' });
        } else {
            res.status(404).json({ error: 'Grocery not found' });
        }
    } catch (err) {
        console.error('Error in deleteGrocery:', err);
        if (err.message === 'Invalid grocery ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete grocery item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

module.exports = {
    getMultiGroceries,
    getOneGrocery,
    addGrocery,
    updateGroceryById,
    deleteGrocery
};