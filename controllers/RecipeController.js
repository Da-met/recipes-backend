import RecipeModel from '../models/Recipe.js';
import UserModel from '../models/User.js';
import SaveRecipesModel from '../models/SaveRecipes.js';

import natural from 'natural';


export const create = async (req, res) => {
    try {
        const doc = new RecipeModel({
            img: req.body.img,
            description: req.body.description,
            products: req.body.products,
            keyWords: req.body.keyWords,
            
            steps: req.body.steps,
            href: req.body.href,
            user: req.userId,
        });

        const recipe = await doc.save();
        res.json(recipe);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать рецепт! :('
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();
        res.json(recipes.reverse());
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const recipeId = req.params.id;
        RecipeModel.findOneAndUpdate(
            { _id: recipeId, }, 
            { $inc: { viewsCount: 1 }, }, 
            { returnDocument: 'after', }, 
        ).populate('user')
        .then((doc, err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть рецепт',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Рецепт не найден',
                    })
                }

                res.json(doc);
            },     
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепт! :('
        });
    }
}

export const remove = async (req, res) => {
    try {
        const recipeId = req.params.id;
        RecipeModel.findOneAndDelete(
            { _id: recipeId, }, 
        ).then((doc, err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить рецепт',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Рецепт не найден',
                    })
                }

                res.json({
                    success: true,
                });
            },     
        );
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепт! :('
        });
    }
}

export const update = async (req, res) => {
    try {
        const recipeId = req.params.id;
    
        await RecipeModel.updateOne({
            _id: recipeId,
        }, {
            img: req.body.img,
            description: req.body.description,
            products: req.body.products,
            keyWords: req.body.keyWords,
            
            steps: req.body.steps,
            href: req.body.href,
            user: req.userId,
        });
        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage: 'Не удалось обновить рецепт',
        });
    }
}


// import natural from 'natural';
// data.filter(it => natural.PorterStemmerRu.stem(JSON.stringify(it)).includes(natural.PorterStemmerRu.stem(<search_string>)));


export const getAllByName = async (req, res) => {
    try {
        const name = req.params.name;
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        // let recipesList = recipers.filter((item) => item.description == name)
        // let recipesList = recipers.description.indexOf('name')

        let recipesList = recipes.filter((item) =>  natural.PorterStemmerRu.stem(JSON.stringify(item.description)).includes(natural.PorterStemmerRu.stem(name)));

        res.json(recipesList);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}

export const getAllByWords = async (req, res) => {
    try {
        const words = req.params.words.split("&");
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        let recipesList = recipes.filter((item) => item.keyWords.toString() == words.toString())
        res.json(recipesList);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}

export const getAllMy = async (req, res) => {
    try {
        const id = req.params.id;
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        let recipesList = recipes.filter((item) => item.user._id == id)
        res.json(recipesList.reverse());
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}

export const getAllMySaveOnFilter = async (req, res) => {
    try {
        const id = req.params.id;
        const recipesIds = await SaveRecipesModel.findOne({user: req.params.id})
        
        const words = req.params.words.split("&");
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        let rrr = recipes.filter(item => recipesIds.savedRecipes.includes(item._id))

        let recipesList = rrr.filter((item) => item.keyWords.toString() == words.toString())
        res.json(recipesList.reverse());
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}

export const getAllMyOnFilters = async (req, res) => {
    try {
        const id = req.params.id;
        const words = req.params.words.split("&");
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();
        
        let recipesList = recipes.filter((item) => item.user._id == id)
        recipesList = recipesList.filter((item) => item.keyWords.toString() == words.toString())
        res.json(recipesList);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}





export const getRecipesUserBlock = async (req, res) => {
    try {
        const id = req.params.id;
        const recipes = await RecipeModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        let recipesList = recipes.filter((item) => item.user._id == id)
        // console.log(recipesList)
        // recipesList.length !== 0 ? recipesList.reverse() : 0
        // res.json(recipesList.length !== 0 ? recipesList.reverse() : 0);
        res.json(recipesList.reverse());

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}