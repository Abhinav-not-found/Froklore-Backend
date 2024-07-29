const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true,
        unique: true
    },
    like: {
        type: [String],
        default: []
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
