// пользовательский класс для операционных ошибок
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        // http статус код ошибки
        this.statusCode = statusCode;
        // определение типа ошибки (fail для 4xx, error для 5xx)
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // флаг, указывающий что ошибка обрабатываемая (не системная)
        this.isOperational = true;

        // захват стека вызовов для отладки
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;