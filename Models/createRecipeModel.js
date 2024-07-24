const mongoose = require('mongoose')
const createRecipeSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    shortDesc:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    ingredients:{
        type:String,
        required:true,
    },
    recipe:{
        type:String,
        required:true,
    },
})
const create = mongoose.model('Create-Recipe',createRecipeSchema)
module.exports = create