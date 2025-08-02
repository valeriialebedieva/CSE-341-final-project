const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

const validateClothesData = (clothesData) => {
    const errors = [];
    
    if (!clothesData.name || typeof clothesData.name !== 'string' || clothesData.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }
    
    if (!clothesData.size || typeof clothesData.size !== 'string' || clothesData.size.trim().length === 0) {
        errors.push('Size is required and must be a non-empty string');
    }
    
    if (!clothesData.price || typeof clothesData.price !== 'number' || clothesData.price <= 0) {
        errors.push('Price is required and must be a positive number');
    }
    
    return errors;
};

const validateObjectId = (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid clothes ID format');
    }
    return new ObjectId(id);
};

// GET ALL CLOTHES
const getMultiClothes = async (req, res) => {
    try {
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('clothes').find();
        const clothes = await result.toArray();
        res.status(200).json(clothes);
    } catch (err) {
        console.error('Error in getMultiClothes:', err);
        res.status(500).json({ 
            error: 'Failed to retrieve clothes',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// GET ONE CLOTHES ITEM
const getOneClothes = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Clothes ID is required' });
        }

        const clothesId = validateObjectId(req.params.id);
        
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('clothes').find({ _id: clothesId });
        const clothes = await result.toArray();
        
        if (clothes.length === 0) {
            return res.status(404).json({ error: 'Clothes item not found' });
        }
        
        res.status(200).json(clothes[0]);
    } catch (err) {
        console.error('Error in getOneClothes:', err);
        if (err.message === 'Invalid clothes ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to retrieve clothes item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// ADD CLOTHES ITEM
const addClothes = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateClothesData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const clothes = {
            name: req.body.name.trim(),
            size: req.body.size.trim(),
            price: req.body.price,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('clothes').insertOne(clothes);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                id: response.insertedId,
                message: 'Clothes item created successfully'
            });
        } else {
            res.status(500).json({ error: 'Failed to create clothes item' });
        }
    } catch (err) {
        console.error('Error in addClothes:', err);
        res.status(500).json({ 
            error: 'Failed to create clothes item',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// UPDATE CLOTHES ITEM
const updateClothesById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Clothes ID is required' });
        }

        const clothesId = validateObjectId(req.params.id);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateClothesData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const clothes = {
            name: req.body.name.trim(),
            size: req.body.size.trim(),
            price: req.body.price,
            updatedAt: new Date()
        };

        const response = await mongodb.getDb().db().collection('clothes').replaceOne({ _id: clothesId }, clothes);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Clothes item not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Clothes item updated successfully' });
        } else {
            res.status(200).json({ message: 'Clothes item data unchanged' });
        }
    } catch (err) {
        console.error('Error in updateClothesById:', err);
        if (err.message === 'Invalid clothes ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to update clothes item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// DELETE CLOTHES ITEM
const deleteClothes = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Clothes ID is required' });
        }

        const clothesId = validateObjectId(req.params.id);

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const response = await mongodb.getDb().db().collection('clothes').deleteOne({ _id: clothesId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Clothes item deleted successfully' });
        } else {
            res.status(404).json({ error: 'Clothes item not found' });
        }
    } catch (err) {
        console.error('Error in deleteClothes:', err);
        if (err.message === 'Invalid clothes ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete clothes item',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

module.exports = {
    getMultiClothes,
    getOneClothes,
    addClothes,
    updateClothesById,
    deleteClothes
}; 