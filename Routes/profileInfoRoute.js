const express = require('express');
const router = express.Router();
const Model = require('../Models/userModel');
const bcrypt = require('bcryptjs');  // Already using bcryptjs

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userInfo = await Model.findById(userId);
        if (userInfo) {
            res.status(200).json({ userInfo });
        } else {
            res.status(404).json({ message: 'User Not Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user profile by ID
router.put('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, username } = req.body;
        const update = await Model.findByIdAndUpdate(userId, { email, username }, { new: true });
        if (update) {
            res.status(200).send('Updated Successfully');
        } else {
            res.status(400).json({ message: 'Something Went Wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Change password
router.patch('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;
        const userExist = await Model.findById(userId);
        if (userExist) {
            const comparison = await bcrypt.compare(oldPassword, userExist.password);  // bcryptjs compare
            if (comparison) {
                const newHashedPassword = await bcrypt.hash(newPassword, 10);  // bcryptjs hash
                const updateUser = await Model.findByIdAndUpdate(userId, { password: newHashedPassword }, { new: true });
                res.status(200).json({ message: 'Password Updated Successfully', user: updateUser });
            } else {
                res.status(401).send('Wrong Old Password');
            }
        } else {
            res.status(400).send('User Not Found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
