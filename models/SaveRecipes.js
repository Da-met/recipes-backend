import mongoose from 'mongoose';

const SaveRecipesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    savedRecipes: {
        type: Array,
    },

    }, 
);

export default mongoose.model('SaveRecipes', SaveRecipesSchema);