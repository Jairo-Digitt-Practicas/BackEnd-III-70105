/** @format */

const errorHandler = (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res
            .status(401)
            .json({ message: "Token inválido o no provisto" });
    }
    res.status(500).json({
        message: "Error en el servidor",
        error: err.message,
    });
};

module.exports = errorHandler;
