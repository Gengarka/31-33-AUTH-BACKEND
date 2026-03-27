// импорт express
import express from "express";
// импорт конфигурации приложения
import config from "./config.js";
// импорт middleware для безопасности заголовков
import helmet from "helmet";
// импорт middleware для настройки cors
import cors from "cors";
// импорт middleware для ограничения количества запросов
import rateLimit from "express-rate-limit";
// импорт middleware для парсинга cookies
import cookieParser from "cookie-parser";
// импорт глобального обработчика ошибок
import errorHandler from "./middleware/errorHandler.js";
// импорт роутера аутентификации
import authRouter from "./routes/auth.js";
// импорт роутера пользователей
import usersRouter from "./routes/users.js";
// импорт swagger документации
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger.js";

// создание экземпляра приложения express
const app = express();

// настройка ограничения запросов: 100 запросов за 15 минут
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// подключение middleware безопасности
app.use(helmet());
// настройка cors
app.use(cors(config.cors));
// парсинг cookies
app.use(cookieParser());
// парсинг json тела запроса
app.use(express.json());
// подключение роутера аутентификации с лимитером
app.use("/api/auth", limiter, authRouter);
// подключение роутера пользователей
app.use("/api/users", usersRouter);
// подключение swagger документации
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// глобальный обработчик ошибок (должен быть последним)
app.use(errorHandler);

// экспорт приложения
export default app;