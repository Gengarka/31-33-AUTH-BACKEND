// импорт функций из модели пользователей
import {
    getAllUsers as getAllUsersModel,
    findUserById,
} from "../models/user.model.js";

// сервис получения всех пользователей
export async function getAllUsers() {
    return getAllUsersModel();
}

// сервис получения пользователя по id (опечатка: fundUserById вместо findUserById)
export async function getUserById(id) {
    return fundUserById(id);
}