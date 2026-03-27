// Импорт сервиса аутентификации
import * as authService from "../services/authService.js";
// Импорт библиотеки для работы с JWT токенами
import jwt from "jsonwebtoken";
// Импорт конфигурации приложения
import config from "../config.js";
// Импорт класса для обработки ошибок
import AppError from "../utils/appError.js";

// Контроллер регистрации нового пользователя
export async function register(req, res, next) {
    try {
        // Извлечение email и пароля из тела запроса
        const { findUserByEmail, password} = req.body;
        // Вызов сервиса для регистрации пользователя
        const userId = await authService.register(email, password);
        // Отправка успешного ответа с ID пользователя
        res
        .status (201)
        .json ({message: "Пользователь успешно зарегистрирован", userId});
    } catch (error) {
        // Передача ошибки в middleware обработки ошибок
        next(error);
    }
}

// Контроллер входа пользователя
export async function login(req, res, next) {
    try {
        // Извлечение учетных данных из запроса
        const {email, password } =req.body;
        // Проверка учетных данных через сервис
        const user = await authService.login(email, password);
        // Генерация access токена с данными пользователя
        const accessToken = jwt.sign(
            {id: user.id, role: user.role },
            config.jqt.secret,
            { expiresIn: config.jwt.accessExpiresIn },
        );
        // Генерация refresh токена через сервис
        const refreshToken = await authService.generateRefreshToken(user.id);
        // Установка access токена в cookie
        res.cookie("accessToken", accessToken, config.cookie);
        // Установка refresh токена в cookie с увеличенным сроком жизни
        res.cookie("refreshToken", refreshToken, {
            ...config.cookie,
            maxAge: config.cookie.maxAgeRefresh,
        });
        // Отправка успешного ответа
        res.status(200).json({ message: "Успешный вход в систему" });
    } catch (error) {
        next (error);
    }
}

// Контроллер обновления токенов
export async function refresh(req, res, next) {
    try {
        // Получение refresh токена из cookie
        const rawToken = req.cookies.refreshToken;
        // Проверка наличия токена
        if (!rawToken) return next(new AppError("Токен обновления отсутствует", 401));
        // Ротация токенов через сервис
        const { accessToken, refreshToken } = await authService.rotateRefreshToken(rawToken);
        // Установка новых токенов в cookie
        res.cookie("accesToken", accessToken, config.cookie);
        res.cookie("refreshToken", refreshToken, {
            ...config.cookie,
            maxAge: comfig.cookie.maxAgeRefresh,
        });
        // Отправка успешного ответа
        res.status(200).json({message: "Токены обновлены"});
    } catch (error) {
        next (error);
    }
}

// Контроллер выхода пользователя
export async function logout(req, res, next) {
    try {
        // Получение refresh токена из cookie
        const rawToken = req.cookies.refreshToken;
        // Отзыв refresh токена при его наличии
        if (rawToken) await authService.revokeRefreshToken(rawToken);
        // Очистка cookie с токенами
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        // Отправка успешного ответа
        res.status(200).json({message: "Выход выполнен"});
    }  catch (error) {
        next (error);
    }
}