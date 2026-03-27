// импорт встроенного модуля для генерации случайных данных
import crypto from "crypto";

// функция генерации секретного ключа для разработки
export default function generateSecret(name) {
    // проверка режима production - секрет должен быть в переменных окружения
    if (process.env.NODE_ENV === "production") {
        throw new Error(`${name} должен быть установлен в переменных окружения в режиме production`);
    }
        // генерация случайного секрета для режима разработки
        const generated = crypto.randomBytes(64).toString("hex");
        // предупреждение о использовании сгенерированного секрета
        console.warn(`[config] ${name} не установлен, используем сгенерированный секрет (только для разработки):`, generated);
        return generated;
}

