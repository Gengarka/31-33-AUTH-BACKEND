// загрузка переменных окружения (опечатка: dotnev вместо dotenv)
import "dotenv/config";

// импорт приложения express
import app from "./src/app.js";
// импорт конфигурации (дублирование импорта)
import config from "./src/config.js";
// импорт подключения к базе данных
import db from "./src/db/db.js";

// функция запуска сервера
const startServer = async () => {
    try {
        // запуск сервера на указанном порту
        app.listen(config.port, () => {
            console.log(`Сервер запущен на https://localhost:${config.port}`);
            console.log(`Документация доступна на https://localhost:${config.port}/api/docs`);
        });
    } catch (error) {
        // обработка ошибки запуска (опечатка: err вместо error)
        console.error("Не удалость запустить сервер:", error);
    }
};

// запуск приложения
startServer();