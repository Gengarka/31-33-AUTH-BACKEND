// Импорт библиотеки SQLite
import Database from "better-sqlite3";
// Импорт конфигурации приложения
import config from "../config.js";

// Создание подключения к базе данных
const db = new Database(config.db.path, {
    // Включение логирования запросов в режиме разработки
    verbose: config.nodeEnv === "development" ? console.log : undefined,
});

// Включение поддержки внешних ключей
db.pragma("foreign_keys = ON");

// Создание таблиц и индексов при отсутствии
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,  
    email              TEXT NOT NULL UNIQUE,               
    password_hash      TEXT NOT NULL,                      
    role               TEXT NOT NULL DEFAULT 'user',     
    created_at         TEXT NOT NULL DEFAULT (datetime('now')), 
    updated_at         TEXT NOT NULL DEFAULT (datetime('now')), 
    last_login         TEXT                              
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,     
    user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash           TEXT NOT NULL UNIQUE,                 
    expires_at           TEXT NOT NULL,                   
    created_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);                   
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
`);

// Логирование успешной инициализации БД
console.log(`БД инициализирована: ${config.db.path}`);

// Экспорт подключения к базе данных
export default db;