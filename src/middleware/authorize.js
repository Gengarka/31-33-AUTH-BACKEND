// импорт класса для обработки ошибок
import AppError from "../utils/appError.js";

// middleware для проверки прав доступа по ролям
const authorize = (...roles) => {
    return (req, res, next) => {
        // проверка наличия роли пользователя в списке разрешенных
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("У вас нет прав для доступа к этому ресурсу", 403),
            );
        }
        // переход к следующему middleware при наличии прав
        next();
    };
};

export default authorize;