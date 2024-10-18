import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import SaveRecipes from '../models/SaveRecipes.js';
import UserModel from '../models/User.js';
import RecipeModel from '../models/Recipe.js';
import SaveRecipesModel from '../models/SaveRecipes.js';


export const getAll = async (req, res) => {
    try {
        const addRecipes = await SaveRecipesModel.find()
            // .populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();
        res.json(addRecipes);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}


export const createASavedRecipe = async (req, res) => {
    try {
        const userId = req.params.id;
        const doc = new SaveRecipesModel({
            user: userId,
            savedRecipes: [],
        })
    
        const saveRecipes = await doc.save();
        res.json(saveRecipes);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить рецепт! :('
        });
    }
}


export const addASavedRecipe = async (req, res) => {
    try {
        const ttt = await SaveRecipesModel.findOne({user: req.params.id})

        await SaveRecipesModel.updateOne({ 
            user: req.params.id,
        },{
            savedRecipes: [
                ...ttt.savedRecipes,
                req.body.idAddRecipe
            ]
        });

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить рецепт! :('
        });
    }
}



export const deleteASavedRecipe = async (req, res) => {
    try {
        const ttt = await SaveRecipesModel.findOne({user: req.params.id})
        const arrWithDelEl = ttt.savedRecipes.filter((it) => it !== req.body.idAddRecipe)
        // console.log(arrWithDelEl)

        await SaveRecipesModel.updateOne({ 
            user: req.params.id,
        },{
            savedRecipes: [
                ...arrWithDelEl,
            ]
        });

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить рецепт! :('
        });
    }
}


// export const deleteASavedRecipe = async (req, res) => {
//     try {
//         const ttt = await SaveRecipesModel.findOne({user: req.params.id})
//         const arrWithDelEl = ttt.savedRecipes.filter((it) => it !== req.body.idAddRecipe)
//         // console.log(arrWithDelEl)

//         await SaveRecipesModel.updateOne({ 
//             user: req.params.id,
//         },{
//             savedRecipes: [
//                 ...arrWithDelEl,
//             ]
//         });

//         res.json({
//             success: true,
//         })

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось добавить рецепт! :('
//         });
//     }
// }


export const getAllMySaveRecipes = async (req, res) => {
    
    try {
        
        const recipesIds = await SaveRecipesModel.findOne({user: req.params.id,})
        
        const recipesAll = await RecipeModel.find().populate({ path: "user", select: [ "fullName", "avatarUrl"] }).exec();
        let rrr = recipesAll.filter(item => recipesIds.savedRecipes.includes(item._id))
        res.json(rrr);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}


