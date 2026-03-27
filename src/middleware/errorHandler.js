// глобальный middleware для обработки ошибок
const errorHandler = (err, req, res, next) => {
    // проверка, является ли ошибка ожидаемой (операционной)
    if (err.isOperational) {
        // отправка клиенту статуса и сообщения об ошибке
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    // логирование необработанных ошибок для отладки
    console.error("Необработанная ошибка:", err);
    // отправка общего сообщения об ошибке без деталей
    res.status(500).json({
        status:"error",
        message: "Что-то пошло не так. Пожалуйста, попробуйте позже."
    });
};

export default errorHandler;