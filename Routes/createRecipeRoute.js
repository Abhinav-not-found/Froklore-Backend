const express =require('express')
const router = express.Router()
const Model = require('../Models/createRecipeModel')
const userModel = require('../Models/userModel')

router.post('/create/:id',async(req,res)=>{
    try {
        const data = req.body
        const userId = req.params.id
        // console.log('Userid',userId)
        // const userExist = await userModel.findById(userId)
        // if(userExist){
            // console.log(`User found: ${userExist.username}`);
            const newRecipe = new Model({...data,userId:userId})
            const saveRecipe = await newRecipe.save()
            res.status(200).json({message:'Saved Successfully',saveRecipe:saveRecipe})
        // }
        // else{
        //     res.status(201).json({message:'User not found'})
        // }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
    }
})
//To display All recipe (All recipe)
router.get('/getAllRecipe',async(req,res)=>{
    try {
        const recipe = await Model.find()
        res.status(200).json(recipe)
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
    }
})


//To display all recipe (My recipe)
router.get('/getRecipe/:id',async(req,res)=>{
    try {
        const userId = req.params.id
        // console.log(`userId: ${userId}`)
        const recipes = await Model.find({userId:userId})
        if(recipes.length > 0){
            res.status(200).json(recipes)
        }
        else{
            res.status(201).json('Not found')
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
    }
})

//To display details of each card (My recipe)
router.get('/recipe/:id',async(req,res)=>{
    try {
        const recipeId = req.params.id
        const recipe = await Model.findById(recipeId)
        if(recipe){
            const userIdInsideRecipe = recipe.userId
            console.log(userIdInsideRecipe)
            // res.status(200).json(recipe)
            const userInfo = await userModel.findById(userIdInsideRecipe)
            if(userInfo){
                res.status(200).json({userInfo,recipe})
            }
            else{
                res.status(404).json('Nothing Found')
            }
        }
        else{
            res.status(404).send('Recipe Not Found')
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
    }
})


// Retrieve Recipe by Id
router.get('/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Model.findById(recipeId);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
});


//Delete Recipe
router.delete('/delete/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const deleteRecipe = await Model.findByIdAndDelete(id)
        res.status(200).send('Deleted Successfully')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Issue' });
    }
})


//getSuggestions
router.get('/getSuggestion/:id',async(req,res)=>{
    try {
        const userId = req.params.id
        const recipeById = await Model.find({userId:userId})
        if(recipeById){
            res.status(200).json({recipeById})
        }
        else{
            res.status(404).send('Not found')
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
    }
})

//updateRecipe
router.patch('/updateRecipe/:recipeId',async(req,res)=>{
    try {
        const recipeId = req.params.recipeId
        const {title,shortDesc,image,ingredients,recipe}=req.body
        const findRecipe = await Model.findByIdAndUpdate(recipeId,{title,shortDesc,image,ingredients,recipe},{new:true})
        if(findRecipe){
            res.status(200).json({message:'Updated',findRecipe:findRecipe})
        }
        else{   
            res.status(404).send('Not found')
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
        console.log(error)
    }
})



//getInfoUserId - profilePage
router.get('/getInfoUserId/:id',async(req,res)=>{
    try {
        const userId = req.params.id
        const getRecipe = await Model.find({userId})
        if(getRecipe.length > 0){
            res.status(200).json({getRecipe})
        }
        else {
            res.status(404).json({ message: 'No recipes found for this user' });
        }
    } catch (error) {
        res.status(500).json({message:'Internal Server Error',error})
        console.log(error)
    }
})
module.exports = router