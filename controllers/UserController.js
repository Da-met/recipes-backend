import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';



export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
            savedRecipes: [],
            quote: '',
        });
    
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, 'pukikaki123', {})

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться!'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'pukikaki123', {});

        const { passwordHash, ...userData } = user._doc;
    
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удлось зарегистрироваться!'
        });
    }
};



export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден!'
            });
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
        
    } catch (err) {
        res.status(500).json({
        message: 'Нет доступа!'
        });
    }
};




export const update = async (req, res) => {
    try {
        const userId = req.params.id;
        await UserModel.updateOne({
            _id: userId,
        },{
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage: 'Не удалось обновиться',
        });
    }
}



export const updateQuote = async (req, res) => {
    try {
        const userId = req.params.id;
        await UserModel.updateOne({
            _id: userId,
        },{
            quote: req.body.quote,
        });
        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage: 'Не удалось обновиться',
        });
    }
}

