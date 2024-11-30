/** @format */

function authorize(role) {
    return (req, res, next) => {
        if (!req.user) {
            console.log("El usuario no está autenticado");
            return res
                .status(403)
                .json({ message: "Acceso denegado. Usuario no autenticado" });
        }

        if (req.user.role !== role) {
            console.log(
                `Rol actual del usuario: ${req.user.role}, Rol requerido: ${role}`
            );
            return res
                .status(403)
                .json({ message: "Acceso denegado. Rol insuficiente" });
        }

        next();
    };
}

module.exports = authorize;
