import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidation, loginValidation, reciperCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, RecipeController, CommentController, SaveRecipesController, UserBlockController, SubscriptionsController } from './controllers/index.js';
import SaveRecipes from './models/SaveRecipes.js';

// const URI = 'mongodb+srv://Da-met:matrena@base-recipes.30apu4f.mongodb.net/repicers?retryWrites=true&w=majority';
// const URI = 'mongodb+srv://Da-met:matrena@base-recipes.30apu4f.mongodb.net/?retryWrites=true&w=majority&appName=Base-RECIPES';


mongoose
    // .connect('mongodb+srv://Da-met:matrena@base-recipes.30apu4f.mongodb.net/repicers?retryWrites=true&w=majority')
    .connect(process.env.MONGODB_URI)

    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({limit: "10mb", extended: true}));
app.use('/uploads', express.static('uploads'))


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/my-profile/edit/:id', checkAuth, UserController.update);




app.get('/user-block/:id',  UserBlockController.getUserBlock);
app.get('/user-block-recipes/:id',  RecipeController.getRecipesUserBlock);


app.post('/add-saved-recipes/:id', checkAuth, SaveRecipesController.createASavedRecipe);
app.patch('/add-saved-recipes/:id', checkAuth, SaveRecipesController.addASavedRecipe);
app.patch('/delete-saved-recipes/:id', checkAuth, SaveRecipesController.deleteASavedRecipe);
app.get('/my-saved-recipes/:id', checkAuth, SaveRecipesController.getAllMySaveRecipes);
app.get('/saved-recipes', SaveRecipesController.getAll);

app.post('/add-list-sbscr/:id', checkAuth, SubscriptionsController.createAListOfSubscribers);
app.patch('/add-list-sbscr/:id', checkAuth, SubscriptionsController.addASubscriber);
app.get('/get-list-sbscr/:id', checkAuth, SubscriptionsController.getAllMySaveSubscribers);
app.patch('/delete-list-sbscr/:id', checkAuth, SubscriptionsController.deleteASavedSubscriber);



app.patch('/add-user-quote/:id', checkAuth, UserController.updateQuote );


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.get('/my-saved-recipes/:id/:words', checkAuth, RecipeController.getAllMySaveOnFilter);
app.get('/my-create-recipes/:id/:words', checkAuth, RecipeController.getAllMyOnFilters);

app.post('/recipes', checkAuth, reciperCreateValidation, handleValidationErrors, RecipeController.create);
app.get('/recipes', RecipeController.getAll);
app.get('/recipes/:id', RecipeController.getOne);
app.delete('/recipes/:id', checkAuth, RecipeController.remove);
app.patch('/recipes/:id', checkAuth, reciperCreateValidation, handleValidationErrors, RecipeController.update);



app.get('/my-profile/:id', checkAuth, RecipeController.getAllMy);


app.get('/recipes-search/:name', RecipeController.getAllByName)
app.get('/recipes-search-words/:words', RecipeController.getAllByWords)

app.post('/comments', checkAuth, CommentController.create);
app.get('/comments/:id', CommentController.getAll);
app.get('/comments-every', CommentController.getEvery);
app.delete('/comment/:id', CommentController.remove);
app.delete('/comments/:id', CommentController.removeAll);

console.log(process) 

app.listen(process.env.MONGODB_URI || 3333, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('SERVER OK');
})

