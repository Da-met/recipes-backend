import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import SubscriptionsModel from '../models/Subscriptions.js';
import UserModel from '../models/User.js';




// export const getAll = async (req, res) => {
//     try {
//         const addSubscr = await SaveRecipesModel.find()
//         res.json(addSubscr);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось получить рецепты! :('
//         });
//     }
// }


export const createAListOfSubscribers = async (req, res) => {
    try {
        const userId = req.params.id;
        const doc = new SubscriptionsModel({
            user: userId,
            subscriptions: [],
        })
    
        const saveSubscribers = await doc.save();
        res.json(saveSubscribers);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось :('
        });
    }
}


export const addASubscriber = async (req, res) => {
    try {
        const ttt = await SubscriptionsModel.findOne({user: req.params.id})
        // console.log(req.body)

        await SubscriptionsModel.updateOne({ 
            user: req.params.id,
        },{
            subscriptions: [
                ...ttt.subscriptions,
                req.body.subscriptions
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


export const getAllMySaveSubscribers = async (req, res) => {
    
    try {
        
        const userIds = await SubscriptionsModel.findOne({user: req.params.id,})
        
        const usersAll = await UserModel.find()
        let findUsers = usersAll.filter(item => userIds.subscriptions.includes(item._id))
        let cleanArrUsers = findUsers.map((it) => ({
            _id: it._id,
            fullName: it.fullName,
            avatarUrl: it.avatarUrl
        }))
        res.json(cleanArrUsers);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить рецепты! :('
        });
    }
}



export const deleteASavedSubscriber = async (req, res) => {
    try {
        const ttt = await SubscriptionsModel.findOne({user: req.params.id})
        const arrWithDelEl = ttt.subscriptions.filter((it) => it !== req.body.subscriptions)
        await SubscriptionsModel.updateOne({ 
            user: req.params.id,
        },{
            subscriptions: [
                ...arrWithDelEl,
            ]
        });

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить! :('
        });
    }
}