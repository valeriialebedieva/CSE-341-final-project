const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

// GET ALL USERS
const getMultiUsers = async (req, res) => {
    try {
        const result = await mongodb.getDb().db().collection('user').find();
        const users = await result.toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to get users' });
    }
};

// GET ONE USER
const getOneUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('user').find({ _id: userId });
        const users = await result.toArray();
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid user ID' });
    }
};

// ADD USER
const addUser = async (req, res) => {
    try {
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password
        };
        const response = await mongodb.getDb().db().collection('user').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid user data' });
    }
};

// UPDATE USER
const updateUserbyId = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password
        };
        const response = await mongodb.getDb().db().collection('user').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'User updated' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid user ID or data' });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('user').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message || 'Invalid user ID' });
    }
};

module.exports = {
    getMultiUsers,
    getOneUser,
    addUser,
    updateUserbyId,
    deleteUser
};