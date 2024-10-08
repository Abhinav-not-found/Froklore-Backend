const express = require('express')
const cors = require('cors')
const path = require('path');
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
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));


app.get('/',(req,res)=>{
    res.send('Hello World!')
})
const userRouter = require('./Routes/userRoutes')
app.use('/',userRouter)

const profileInfoRoute = require('./Routes/profileInfoRoute')
app.use('/',profileInfoRoute)

const createRecipeRoute = require('./Routes/createRecipeRoute')
app.use('/',createRecipeRoute)

const likeRoute = require('./Routes/likeRoute')
app.use('/',likeRoute)



app.listen(process.env.PORT,()=>{
    console.log(`Server Sucessfully Started`.bgCyan)  
})