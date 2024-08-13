const express = require('express');
const Model = require('../Models/userModel');
const router = express.Router();
const bcrypt = require('bcryptjs');  // Changed from bcrypt to bcryptjs
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existingEmail = await Model.findOne({ email });
        if (existingEmail) {
            return res.status(400).send('Email Already Used');
        }
        const existingUsername = await Model.findOne({ username });
        if (existingUsername) {
            return res.status(400).send('Username Already Used');
        }
        const hashedPassword = await bcrypt.hash(password, 10);  // Using bcryptjs to hash password
        const newUser = new Model({ email, password: hashedPassword, username });
        const saveUser = await newUser.save();
        res.status(200).json({ message: 'User Created Successfully', saveUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFind = await Model.findOne({ email });
        if (!userFind) {
            return res.status(401).send('User Not Found!!!');
        }
        const passwordVerify = await bcrypt.compare(password, userFind.password);  // Using bcryptjs to compare password
        if (!passwordVerify) {
            return res.status(500).send('Incorrect Password');
        }
        const userId = userFind._id;
        const token = jwt.sign({ userId: userFind._id, email: userFind.email }, process.env.KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login Successful', userId, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
});

// Check user validity
router.post('/checkUserValidity', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid UserId' });
        }
        const checkUser = await Model.findById(userId);
        if (checkUser) {
            res.status(200).json({ message: 'User Found', checkUser });
        } else {
            res.status(404).json({ message: 'User not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
});

// Get user info
router.get('/getUserInfo/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const findUser = await Model.findById(userId);
        res.status(200).json({ findUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
});

module.exports = router;
