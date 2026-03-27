// импорт библиотеки для работы с jwt токенами
import jwt from "jsonwebtoken";
// импорт конфигурации приложения
import config from "../config.js";
// импорт класса для обработки ошибок
import AppError from "../utils/appError.js";

// middleware для проверки аутентификации
export default function authenticate(req, res, next) {
    // получение access токена из cookie
    const token = req.cookies.accessToken;
    // проверка наличия токена
    if (!token) return next(new AppError("Вы не авторизованы", 401));

    try {
        // верификация и декодирование токена
        const decode = jwt.verify(token, config.jqt.secret);
        // сохранение данных пользователя в запросе
        req.user = decoded;
        // переход к следующему middleware
        next();
    } catch (error) {
        // обработка невалидного или просроченного токена
        return next(new AppError("Нейдиствительный или истёкший токен", 401));
    }
}