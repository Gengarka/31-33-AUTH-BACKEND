// импорт функции валидации и схем
import { validate,  registerSchema, loginSchema } from "../validators/auth.js";
// импорт контроллеров аутентификации
import {register, login, refresh, logout } from "../controllers/authController.js";
// импорт middleware для проверки аутентификации
import authenticate from "../middleware/authenticate.js";
// импорт роутера express
import {Router} from "express";

// создание экземпляра роутера
const router = Router();

// маршрут регистрации с валидацией данных
router.post("/register", validate(registerSchema), register);
// маршрут входа с валидацией данных
router.post("/login", validate(loginSchema), login);
// маршрут обновления токенов
router.post("/refresh", refresh);
// маршрут выхода с проверкой аутентификации
router.post("/logout", authenticate, logout);

// экспорт роутера
export default router;