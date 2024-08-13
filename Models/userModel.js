const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    // profilePic: { 
    //     type: String,
    //     default: null,
    //     required:false
    // }
})
const users = mongoose.model('user',userSchema)
module.exports = users