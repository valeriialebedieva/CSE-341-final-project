const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

const validateElectronicsData = (electronicsData) => {
    const errors = [];
    
    if (!electronicsData.name || typeof electronicsData.name !== 'string' || electronicsData.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }
    
    if (!electronicsData.brand || typeof electronicsData.brand !== 'string' || electronicsData.brand.trim().length === 0) {
        errors.push('Brand is required and must be a non-empty string');
    }
    
    if (!electronicsData.price || typeof electronicsData.price !== 'number' || electronicsData.price <= 0) {
        errors.push('Price is required and must be a positive number');
    }
    
    return errors;
};

const validateObjectId = (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid electronics ID format');
    }
    return new ObjectId(id);
};

// GET ALL ELECTRONICS
const getMultiElectronics = async (req, res) => {
    try {
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('electronics').find();
        const electronics = await result.toArray();
        res.status(200).json(electronics);
    } catch (err) {
        console.error('Error in getMultiElectronics:', err);
        res.status(500).json({ 
            error: 'Failed to retrieve electronics',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// GET ONE ELECTRONICS ITEM
const getOneElectronics = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Electronics ID is required' });
        }

        const electronicsId = validateObjectId(req.params.id);
        
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('electronics').find({ _id: electronicsId });
        const electronics = await result.toArray();
        
        if (electronics.length === 0) {
            return res.status(404).json({ error: 'Electronics item not found' });
        }
        
        res.status(200).json(electronics[0]);
    } catch (err) {
        console.error('Error in getOneElectronics:', err);
        if (err.message === 'Invalid electronics ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to retrieve electronics item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// ADD ELECTRONICS ITEM
const addElectronics = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateElectronicsData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const electronics = {
            name: req.body.name.trim(),
            brand: req.body.brand.trim(),
            price: req.body.price,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('electronics').insertOne(electronics);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                id: response.insertedId,
                message: 'Electronics item created successfully'
            });
        } else {
            res.status(500).json({ error: 'Failed to create electronics item' });
        }
    } catch (err) {
        console.error('Error in addElectronics:', err);
        res.status(500).json({ 
            error: 'Failed to create electronics item',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// UPDATE ELECTRONICS ITEM
const updateElectronicsById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Electronics ID is required' });
        }

        const electronicsId = validateObjectId(req.params.id);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateElectronicsData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const electronics = {
            name: req.body.name.trim(),
            brand: req.body.brand.trim(),
            price: req.body.price,
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('electronics').replaceOne({ _id: electronicsId }, electronics);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Electronics item not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Electronics item updated successfully' });
        } else {
            res.status(200).json({ message: 'Electronics item data unchanged' });
        }
    } catch (err) {
        console.error('Error in updateElectronicsById:', err);
        if (err.message === 'Invalid electronics ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to update electronics item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// DELETE ELECTRONICS ITEM
const deleteElectronics = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Electronics ID is required' });
        }

        const electronicsId = validateObjectId(req.params.id);

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const response = await mongodb.getDb().db().collection('electronics').deleteOne({ _id: electronicsId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Electronics item deleted successfully' });
        } else {
            res.status(404).json({ error: 'Electronics item not found' });
        }
    } catch (err) {
        console.error('Error in deleteElectronics:', err);
        if (err.message === 'Invalid electronics ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete electronics item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

module.exports = {
    getMultiElectronics,
    getOneElectronics,
    addElectronics,
    updateElectronicsById,
    deleteElectronics
}; 