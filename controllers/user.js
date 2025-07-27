const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

const validateUserData = (userData) => {
    const errors = [];
    
    if (!userData.firstname || typeof userData.firstname !== 'string' || userData.firstname.trim().length === 0) {
        errors.push('First name is required and must be a non-empty string');
    }
    
    if (!userData.lastname || typeof userData.lastname !== 'string' || userData.lastname.trim().length === 0) {
        errors.push('Last name is required and must be a non-empty string');
    }
    
    if (!userData.username || typeof userData.username !== 'string' || userData.username.trim().length === 0) {
        errors.push('Username is required and must be a non-empty string');
    }
    
    if (!userData.password || typeof userData.password !== 'string' || userData.password.length < 6) {
        errors.push('Password is required and must be at least 6 characters long');
    }
    
    return errors;
};

const validateObjectId = (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
    }
    return new ObjectId(id);
};

// GET ALL USERS
const getMultiUsers = async (req, res) => {
    try {
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('user').find();
        const users = await result.toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error in getMultiUsers:', err);
        res.status(500).json({ 
            error: 'Failed to retrieve users',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// GET ONE USER
const getOneUser = async (req, res) => {
    try {
       
        if (!req.params.id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const userId = validateObjectId(req.params.id);
        
        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await mongodb.getDb().db().collection('user').find({ _id: userId });
        const users = await result.toArray();
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(users[0]);
    } catch (err) {
        console.error('Error in getOneUser:', err);
        if (err.message === 'Invalid user ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to retrieve user',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// ADD USER
const addUser = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateUserData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const user = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            username: req.body.username.trim(),
            password: req.body.password,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Check if username already exists
        const existingUser = await mongodb.getDb().db().collection('user').findOne({ username: user.username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const response = await mongodb.getDb().db().collection('user').insertOne(user);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                id: response.insertedId,
                message: 'User created successfully'
            });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    } catch (err) {
        console.error('Error in addUser:', err);
        res.status(500).json({ 
            error: 'Failed to create user',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// UPDATE USER
const updateUserbyId = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const userId = validateObjectId(req.params.id);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is required and must be an object' });
        }

        const validationErrors = validateUserData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors
            });
        }

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const user = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            username: req.body.username.trim(),
            password: req.body.password,
            updatedAt: new Date()
        };
 
        const existingUser = await mongodb.getDb().db().collection('user').findOne({ 
            username: user.username,
            _id: { $ne: userId }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const response = await mongodb.getDb().db().collection('user').replaceOne({ _id: userId }, user);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(200).json({ message: 'User data unchanged' });
        }
    } catch (err) {
        console.error('Error in updateUserbyId:', err);
        if (err.message === 'Invalid user ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to update user',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        
        if (!req.params.id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const userId = validateObjectId(req.params.id);

        if (!mongodb.getDb()) {
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const response = await mongodb.getDb().db().collection('user').deleteOne({ _id: userId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error in deleteUser:', err);
        if (err.message === 'Invalid user ID format') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ 
                error: 'Failed to delete user',
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
        }
    }
};

module.exports = {
    getMultiUsers,
    getOneUser,
    addUser,
    updateUserbyId,
    deleteUser
};