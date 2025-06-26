function codeRequest(req) {
    try {
        if (req.session && req.session.change_code) {
            // Retorna el resultado sin utilizar res aquí
            console.log(req.session.change_code);
            return { 
                success: true, 
                message: "Código recuperado correctamente.", 
                code: req.session.change_code,
            };
        } else {
            console.error('Error: No se encontró el código en la sesión.');
            // Retorna un objeto indicando que hubo un error
            return { 
                success: false, 
                message: "Error al recuperar el código.",
                code: null,
            };
        }
    } catch (error) {
        console.error('Error al recuperar el código:', error);
        // Manejo de errores
        return { 
            success: false, 
            message: "Error interno del servidor.",
            code: null,
        };
    }
}

module.exports = { codeRequest };