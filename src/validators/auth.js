// импорт библиотеки валидации
import Joi from "joi";
// импорт класса для обработки ошибок
import AppError from "../utils/appError.js";

// схема валидации регистрации
const registerSchema = Joi.object({
    email: Joi.string().email().required(),    // обязательный email
    password: Joi.string().min(8).required(),  // обязательный пароль минимум 8 символов
});

// схема валидации входа
const loginSchema = Joi.object({
    email: Joi.string().email().required(),    // обязательный email
    password: Joi.string().min(8).required(),  // обязательный пароль минимум 8 символов
});

// middleware для валидации данных запроса по схеме
export function validate(schema) {
    return (req, res, next) => {
        // валидация тела запроса
        const { error } = schema.validate(req.body);
        if (error) {
            // передача ошибки валидации
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
}

// экспорт схем валидации
export { registerSchema, loginSchema };