import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import CommentModel from '../models/Comment.js';



export const create = async (req, res) => {
    try {
    
        const doc = new CommentModel({
            idReciper: req.body.idReciper,
            textComment: req.body.textComment,
            user: req.userId,
        });
    
        const comment = await doc.save();
        res.json(comment);
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить комментарий!'
        });
    }
};


export const getAll = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const comments = await CommentModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        let commentsList = comments.filter((item) => item.idReciper == recipeId)

        res.json(commentsList);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось загрузить комментарии! :('
        });
    }
}


export const getEvery = async (req, res) => {
    try {
        // const recipeId = req.params.id;
        const comments = await CommentModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        // let commentsList = comments.filter((item) => item.idReciper == recipeId)
        // res.json(commentsList);
        
        res.json(comments);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось загрузить комментарии! :('
        });
    }
}



export const remove = async (req, res) => {

    try {
        const idComment = req.params.id;
        CommentModel.findOneAndDelete(
            { _id: idComment, }, 
        ).then((doc, err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить комментарий',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Что-то пошло не так :(',
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
            message: 'Не удалось удалить комментарий ! :('
        });
    }
}


export const removeAll = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const comments = await CommentModel.deleteMany({idReciper: recipeId}).populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();
        
        // let commentsList = comments.filter((item) => item.idReciper !== recipeId)
        // console.log(comments)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить комментарии ! :('
        });
    }



    // try {
    //     const idComment = req.params.id;
    //     CommentModel.findOneAndDelete(
    //         { _id: idComment, }, 
    //     ).then((doc, err) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).json({
    //                     message: 'Не удалось удалить комментарий',
    //                 });
    //             }
    //             if (!doc) {
    //                 return res.status(404).json({
    //                     message: 'Что-то пошло не так :(',
    //                 })
    //             }

    //             res.json({
    //                 success: true,
    //             });
    //         },     
    //     );
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({
    //         message: 'Не удалось удалить комментарий ! :('
    //     });
    // }
}