const express = require('express')
const Model = require('../Models/userModel')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()
//REGISTER
router.post('/register',async(req,res)=>{
    try {
        const {email,password,username} = req.body
        const existingEmail = await Model.findOne({email})
        if(existingEmail){
            res.status(201).send('Email Already Used')
        }
        else{
            const existingUsername = await Model.findOne({username})
            if(existingUsername){
                res.status(202).send('Username Already Used')

            }
            else{
                const hashedPassword = await bcrypt.hash(password,10)
                const newUser = new Model({email,password:hashedPassword,username})
                const saveUser = await newUser.save();
                res.status(200).json({message:"User Created Successfully",saveUser})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Issue"})
    }
})

//LOGIN
router.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body
        const userFind = await Model.findOne({email})
        if(!userFind){
            res.status(401).send('User Not Found!!!')
        }
        else{
            const passwordVerify = await bcrypt.compare(password,userFind.password)
            if(!passwordVerify){
                res.status(500).send('Incorrect Password')
            }
            else{
                const userId = userFind._id
                const token = jwt.sign({userId:userFind._id,email:userFind.email},process.env.KEY,{expiresIn:'1h'})
                res.status(200).json({message:'Login Successfull',userId,token})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Issue"})
    }
})

//CheckUserValidity
router.post('/checkUserValidity',async(req,res)=>{
    try {
        const {userId} = req.body
        console.log('Recieved userId:',userId)

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid UserId' });
        }

        const checkUser = await Model.findById(userId)
        if(checkUser){
            res.status(200).json({message:'User Found',checkUser:checkUser})
        }
        else{
            res.status(404).json({message:'User not Found'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Issue"})
    }
})

//getUserInfo
router.get('/getUserInfo/:id',async(req,res)=>{
    try {
        const userId = req.params.id
        // console.log(userId)
        const findUser = await Model.findById(userId)
        res.status(200).json({findUser})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Issue"})
    }
})

module.exports = router 