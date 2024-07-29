const express = require('express');
const router = express.Router();
const LikeModel = require('../models/likeModel'); // Ensure the correct path

// Add a like
router.put('/like', async (req, res) => {
    try {
        const { userId, recipeId } = req.body; // Extract userId and recipeId from the request body

        if (!userId || !recipeId) {
            return res.status(400).json({ message: 'User ID and Recipe ID are required' });
        }

        // Find the document by recipeId
        let likeInfo = await LikeModel.findOne({ recipeId });

        if (likeInfo) {
            // Check if the userId already exists in the like array
            if (likeInfo.like.includes(userId)) {
                return res.status(400).json({ message: 'User has already liked' });
            } else {
                // Append userId to the like array
                likeInfo.like.push(userId);
                await likeInfo.save();
                return res.status(200).json({ message: 'Like added', data: likeInfo });
            }
        } else {
            // Create a new document if it doesn't exist
            const newLike = new LikeModel({ recipeId, like: [userId] });
            await newLike.save();
            return res.status(201).json({ message: 'Like added', data: newLike });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Remove a like
router.put('/unLike', async (req, res) => {
    try {
        const { userId, recipeId } = req.body; // Extract userId and recipeId from the request body

        if (!userId || !recipeId) {
            return res.status(400).json({ message: 'User ID and Recipe ID are required' });
        }

        // Find the document by recipeId
        let likeInfo = await LikeModel.findOne({ recipeId });

        if (likeInfo) {
            // Check if the userId exists in the like array
            if (likeInfo.like.includes(userId)) {
                // Remove userId from the like array
                likeInfo.like = likeInfo.like.filter(id => id !== userId);
                await likeInfo.save();
                return res.status(200).json({ message: 'Like removed', data: likeInfo });
            } else {
                return res.status(400).json({ message: 'User has not liked' });
            }
        } else {
            return res.status(404).json({ message: 'No like information found for the recipe' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get like information for a specific recipe
router.get('/getLikeInfo/:recipeId', async (req, res) => {
    try {
        const { recipeId } = req.params; // Extract recipeId from the request parameters

        if (!recipeId) {
            return res.status(400).json({ message: 'Recipe ID is required' });
        }

        // Find the document by recipeId
        let likeInfo = await LikeModel.findOne({ recipeId });

        if (likeInfo) {
            return res.status(200).json({ data: likeInfo });
        } else {
            return res.status(404).json({ message: 'No like information found for the recipe' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
