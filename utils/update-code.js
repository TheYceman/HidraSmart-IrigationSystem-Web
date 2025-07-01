
const { hashatePassword } = require("../config/hashate-password");
const User = require('../models/user.model');

async function updateCode(req) {
    const sixDigitCode = generateSixDigitCode().toString();
    try {
        const hashedCode = hashatePassword(sixDigitCode);
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
        const user = await User.findOne({
            where: { email: req.session.user[0].email },
          });
      
          if (!user) {
            return {
              success: false,
              message: "Usuario no encontrado",
            };
          }
      
          // Actualizar sus campos de recuperación
          user.reset_code = hashedCode;
          user.reset_code_expiration = expirationTime;
      
          // Guardar cambios en la BD
          await user.save();
        if (req.session) {
            req.session.change_code = hashedCode;
            // Retorna el resultado sin utilizar res aquí
            return { 
                success: true, 
                message: "Código grabado correctamente en la sesión.", 
                code: sixDigitCode, 
            };
        } else {
            console.error('Error: No se guardó el código en la sesión.');
            // Retorna un objeto indicando que hubo un error
            return { 
                success: false, 
                message: "Error al grabar el código en la sesión." 
            };
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        // Manejo de errores
        return { 
            success: false, 
            message: "Error interno del servidor." 
        };
    }
    function generateSixDigitCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}

module.exports = { updateCode };