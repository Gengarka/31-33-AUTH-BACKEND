// загрузка переменных окружения из .env файла
import "dotenv/config";
// импорт функции генерации секрета для разработки
import generateSecret from "./utils/generateSecret";

// объект конфигурации приложения
const config = {
    // порт сервера
    port: process.env.PORT || 3000,

    // настройки jwt токенов
    jwt: {
        // секретный ключ для подписи токенов
        secret: process.env.JWT_SECRET || generateSecret("JWT_SECRET"),
        // время жизни access токена
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRIES_IN || "15m",
        // время жизни refresh токена
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },

    // настройки cookie
    cookie: {
        // флаг secure для https
        secure: process.env.COOKIE_SECURE === "true",
        // ограничение отправки cookie тем же сайтом
        sameSite: "strict",
        // запрет доступа к cookie из javascript
        httpOnly: true,
        // максимальный возраст refresh токена в миллисекундах
        maxAgeRefresh: 7 * 24 * 60 * 60 * 1000,
    },

    // настройки cors
    cors: {
        // разрешенный источник запросов
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        // разрешение отправки credentials
        credentials: true,
    },

    // настройки базы данных
    db: {
        // путь к файлу базы данных sqlite
        path: process.env.DB_PATH || "./database.db",
    },

    // режим запуска приложения
    nodeEnv: process.env.NODE_ENV || "development",
};

// экспорт конфигурации
export default config;