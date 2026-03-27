// импорт роутера express
import {Router} from "express";
// импорт контроллеров пользователей
import {getAllUsers, getUserById } from "../controllers/userController.js";
// импорт middleware для проверки аутентификации
import authenticate from "../middleware/authenticate.js";
// импорт middleware для проверки прав доступа
import authorize from "../middleware/authorize.js";

// создание экземпляра роутера
const router = Router();

// применение middleware ко всем маршрутам: проверка аутентификации и роль admin
router.use(authenticate, authorize("admin"));

// маршрут получения всех пользователей
router.get("/", getAllUsers);
// маршрут получения пользователя по id (опечатка: точка с запятой вместо двоеточия)
router.get("/;id", getUserById);

// экспорт роутера
export default router;