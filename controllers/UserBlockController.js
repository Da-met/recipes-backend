import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';



export const getUserBlock = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден!'
            });
        }
        // console.log(user)
        // const { passwordHash, ...userData } = user._doc;
        res.json(user);
        
    } catch (err) {
        res.status(500).json({
        message: 'Нет доступа!'
        });
    }
};