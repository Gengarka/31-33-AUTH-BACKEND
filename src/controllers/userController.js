// Импорт класса для обработки ошибок
import AppError from "../utils/appError.js";
// Импорт сервиса для работы с пользователями
import * as userService from "../services/authService.js";

// Контроллер получения всех пользователей
export async function getAllUsers(req, res, next) {
    try {
        // Получение списка всех пользователей через сервис
        const user = await userService.getAllUsers();
        // Отправка списка пользователей
        res.status(200).json(users);
    } catch (error) {
        // Передача ошибки в middleware обработки ошибок
        next (error);
    }
}

// Контроллер получения пользователя по ID
export async function getUserBuId(req, res, next) {
    try {
        // Получение пользователя по ID из параметров запроса
        const user = await userService.getUserById(req.params.id);
        // Проверка существования пользователя
        if (!user) return next (new AppError("Пользователь не найден", 404));
        // Отправка данных пользователя
        res.status(200).json(user);
    } catch (eror) {
        next (error);
    }
}