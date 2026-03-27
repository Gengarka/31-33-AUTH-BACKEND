// импорт библиотеки для хеширования паролей
import bcrypt from "bcryptjs";
// импорт встроенного модуля для генерации случайных данных
import crypto from "crypto";
// импорт класса для обработки ошибок
import AppError from "../utils/appError.js";
// импорт функций для работы с базой данных
import {findUserByEmail, createUser, saveRefreshToken, findRefreshToken, deleteRefreshToken, findUserById } from "../models/user.model.js";
// импорт конфигурации приложения
import config from "../config.js";
// импорт библиотеки для работы с jwt
import jwt from "jsonwebtoken";

// сервис регистрации нового пользователя
export async function register(email, password) {
    // проверка существования пользователя с таким email
    const existingUser = await findUserByEmail(email);
    if(existingUser) {
        throw new AppError("Электронный адрес уже используется.", 400);
    }
    // хеширование пароля
    const passwordHash = await bcrypt.hash(password, 12);
    // создание пользователя с ролью user
    return await createUser(email, passwordHash, "user");
}

// сервис аутентификации пользователя
export async function login(email, password) {
    // поиск пользователя по email
    const user = await findUserByEmail(email);
    if (!user){
        throw new AppError("Неверный электронный адрес или пароль.", 401);
    }
    // проверка соответствия пароля
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if(!passwordMatch) {
        throw new AppError("Неверный электронный адрес или пароль.", 401);
    }
    return user;
}

// сервис генерации refresh токена
export async function generateRefreshToken(userId) {
    // генерация случайного токена
    const rawToken = crypto.randomBytes(64).toString("hex");
    // хеширование токена для хранения в бд
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    // установка срока действия 7 дней
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    // сохранение хеша токена
    await saveRefreshToken(userId, tokenHash, expiresAt);
    // возврат сырого токена клиенту
    return rawToken;
}

// сервис ротации токенов при обновлении
export async function rotateRefreshToken(rawToken) {
    // хеширование полученного токена
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    // поиск токена в бд
    const stored = await findRefreshToken(tokenHash);

    // проверка существования и срока действия токена
    if(!stored || new Date(stored.expires_at) < new Date()) {
        throw new AppError("Недействительный или истёкший токен", 401);
    }

    // удаление использованного refresh токена (one-time use)
    await deleteRefreshToken(tokenHash);

    // получение данных пользователя
    const user = await findUserById(stored.user_id);
    if (!user) throw new AppError("Пользователь не найден", 401);

    // генерация нового access токена
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        config.jwt.secret, 
        { expiresIn: config.jwt.accessExpiresIn },
    );
    // генерация нового refresh токена
    const newRawRefreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken: newRawRefreshToken };
}

// сервис отзыва refresh токена при выходе
export async function revokeRefreshToken(rawToken) {
    // хеширование токена и удаление из бд
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await deleteRefreshToken(tokenHash);
}