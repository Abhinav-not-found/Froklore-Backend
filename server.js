const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
require('colors')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB).then(()=>{
    console.log('Database Connected Successfully'.bgGreen)
})


app.use(cors())
app.use(express.json())


const Multer = require('./Multer')
app.use('/',Multer)


app.get('/',(req,res)=>{
    res.send('Hello World!')
})
const userRouter = require('./Routes/userRoutes')
app.use('/',userRouter)

const profileInfoRoute = require('./Routes/profileInfoRoute')
app.use('/',profileInfoRoute)

const createRecipeRoute = require('./Routes/createRecipeRoute')
app.use('/',createRecipeRoute)





app.listen(process.env.PORT,()=>{
    console.log(`Server Sucessfully Started`.bgCyan)  
})