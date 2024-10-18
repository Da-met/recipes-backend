import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Укажите имя').isLength({ min: 2 }),
    // body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
];

export const reciperCreateValidation = [
    body('img', 'Добавьте обложку рецепту').isString(),
    body('description', 'Укажите название блюда').isLength({ min: 2 }).isString(),
    body('products', 'Добавьте продукты').isLength({ min: 2 }).isArray(),
    body('keyWords', 'Укажите ключевые слова').isLength({ min: 1 }).isArray(),
    body('steps', 'Добавьте шаги').optional().isArray(),
    body('href', 'Укажите ссылку на рецепт').optional().isString(),
];

export const commentValidation = [
    body('idReciper', 'Неверный id рецепта'),
    // body('user', 'Что-то пошло не так'),
    body('textComment', 'Введите свой комментарий').isLength({ min: 2 }),
];