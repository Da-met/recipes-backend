import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    idReciper: {
        type: String,
        required: true,
    },
    textComment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    }, 
    { timestamps: true, }
);

export default mongoose.model('Comment', CommentSchema);