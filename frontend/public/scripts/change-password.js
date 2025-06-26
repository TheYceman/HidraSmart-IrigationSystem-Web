async function getToken() {
  try {
    return await grecaptcha.enterprise.execute(
      "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX",
      { action: "changePassword" }
    );
  } catch (error) {
    console.error("Error al obtener token de reCAPTCHA:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de verificación",
      text: "No se pudo verificar la solicitud. Inténtalo de nuevo.",
      confirmButtonText: "Aceptar",
    });
    return;
  }
}

async function checkPassword(username, currentPassword, newPassword) {
  let token = await getToken();
  try {
    const response = await fetch("/api/checkPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        oldPassword: currentPassword,
        newPassword: newPassword,
        token: token,
      }),
    });
    return response.ok;

  } catch (error) {
    console.error("Error al verificar contraseña:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonText: "Aceptar",
    });
    return false;
  }
}

async function proceedChangePassword(fadeMixinNotTime, currentPassword, newPassword) {
  let token = await getToken();

  try {
    const response = await fetch("/api/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
        token: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud de cambio de contraseña");
    }
    const data = await response.json();
    if (data.success) {
      fadeMixinNotTime.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "La contraseña ha sido actualizada correctamente.",
        confirmButtonText: "Aceptar",
      });
      return true;
    } else {
      fadeMixinNotTime.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: data.message || "No se pudo cambiar la contraseña.",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonText: "Aceptar",
    });
    return false;
  }
}

export const handleChangePassword = async (e, username, currentPassword, newPassword, confirmPassword, fadeMixinNotTime, two_factor_enabled, userEmail) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    fadeMixinNotTime.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos.",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    fadeMixinNotTime.fire({
      icon: "warning",
      title: "Contraseñas no coinciden",
      text: "La nueva contraseña y su confirmación deben ser iguales.",
      confirmButtonText: "Aceptar",
    });
    return;
  }
  // Corrige esto, ya que la función es asíncrona, pero necesito saber si la comprobación devuelve true o false
  const checkedPassword = await checkPassword(username, currentPassword, newPassword);
  if (checkedPassword) {
    if (two_factor_enabled == 1) {
      const sendingemail = userEmail;
      const sendingsubject = 'Código de verificación';
      const sendingmessage = 'Inicio de sesión.';
      const resultVerificationCode = await sendingDataForVerificationCode(sendingemail, sendingsubject, sendingmessage);
      let resultChangeCodeRequest;
      try {
        resultChangeCodeRequest = await showMessageCodeRequest(sendingemail, 'double');
      } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
      }
      if (resultChangeCodeRequest.success === true) {
        return proceedChangePassword(fadeMixinNotTime, currentPassword, newPassword);
      }
    } else {
      return proceedChangePassword(fadeMixinNotTime, currentPassword, newPassword);
    }
  }else{
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Contraseña incorrecta",
      text: "La antigua contraseña es incorrecta",
      confirmButtonText: "Aceptar",
    });
  }
}