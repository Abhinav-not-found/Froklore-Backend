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
        required:false,
        default:''
    },
    ingredients:{
        type:String,
        required:true,
    },
    recipe:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    createdAt:{
        type:String,
        required:true,
        default: () => {
            const date = new Date();
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        }
    }
})
const create = mongoose.model('Create-Recipe',createRecipeSchema)
module.exports = create