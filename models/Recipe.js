import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        required: true,
    },
    keyWords: {
        type: Array,
        required: true,
    },
    steps: {
        type: Array,
        // default: [],
    },
    href: {
        type: String,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, 
    { timestamps: true, }
);

export default mongoose.model('Recipe', RecipeSchema);