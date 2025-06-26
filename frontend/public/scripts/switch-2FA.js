async function sendingDataForVerificationCode(sendingemail, sendingsubject, sendingmessage) {
  let sendingResult = await fetch(
    `/api/sendVerificationCode`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sendingemail: sendingemail, sendingsubject: sendingsubject, sendingmessage: sendingmessage }),
    }
  );
  if (sendingResult.ok) {
    const response = await sendingResult.json();
    return response.success;
  } else {
    const errorResponse = await sendingResult.json();
    const errorMessage = errorResponse.message;
    console.error(errorMessage);
  }
}

async function proceedSwitch2FA(fadeMixinNotTime, two_factor_enabled){
  let token;
  try {
    token = await grecaptcha.enterprise.execute(
      "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX",
      { action: "switch2FA" }
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

  try {
    const response = await fetch("/api/switch2FA", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        two_factor_enabled: two_factor_enabled,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud de cambio de autenticación");
    }
    const data = await response.json();
    if (data.success) {
      fadeMixinNotTime.fire({
        icon: "success",
        title: "Autenticación cambiada",
        text: "La configuración de autenticación ha sido actualizada correctamente.",
        confirmButtonText: "Aceptar",
      });
      return true;
    } else {
      fadeMixinNotTime.fire({
        icon: "error",
        title: "Error al cambiar autenticación",
        text: data.message || "No se pudo cambiar la configuración de autenticación.",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  } catch (error) {
    console.error("Error al cambiar autenticación:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonText: "Aceptar",
    });
    return false;
  }
}

export const handleSwitch2FA = async (fadeMixinNotTime, two_factor_enabled, userEmail) => {
  if (two_factor_enabled == 1) {
    const sendingemail = userEmail;
    const sendingsubject = 'Código de verificación';
    const sendingmessage = 'Desactivar doble verificación.';
    const resultVerificationCode = await sendingDataForVerificationCode(sendingemail, sendingsubject, sendingmessage);
    let resultChangeCodeRequest;
    try {
      resultChangeCodeRequest = await showMessageCodeRequest(sendingemail, 'double');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
    if (resultChangeCodeRequest.success === true) {
      return proceedSwitch2FA(fadeMixinNotTime, two_factor_enabled);
    }
  } else {
    return proceedSwitch2FA(fadeMixinNotTime, two_factor_enabled);
  }
}

export async function showMessageCodeRequest(sendingemail, sendingtype, sendingvalue, icon) {
  if (!icon) {
    icon = "question";
  }

  const { value: formValues } = await Swal.fire({
    icon: icon,
    title: "Introduzca el código enviado al email",
    html: `
          <input id="swal-input1" class="swal2-input">
        `,
    focusConfirm: false,
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return document.getElementById("swal-input1").value;
    },
    didOpen: () => {
      document.querySelector('.swal2-popup').style.setProperty('width', '32em', 'important');
      document.querySelector('.swal2-popup').style.setProperty('justify-items', 'center', 'important');
      document.querySelector('.swal2-input').style.setProperty('margin', '1em 0em', 'important');
    }
  });

  const handleCleanup = () => {
    if (sendingtype === 'double') {
      //clearImputsLogin();
    } else if (sendingtype === 'changePassForgotPassword') {
      clearForm();
    } else if (sendingtype === 'changePassPopupCofiguration' || sendingtype === 'changeCode') {
      closePopupHidraSmart();
    }
  };

  if (formValues) {
    try {
      let sendingResult = await fetch(`/api/checkCodeRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sendingemail: sendingemail, sixDigitCode: formValues, sendingtype: sendingtype, sendingvalue: sendingvalue }),
      });

      const response = await sendingResult.json();

      if (response.success && response.validation) {
        Swal.fire({
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500
        });
        return { success: true, message: response.message, validation: true, code: response.code };
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Ocurrió un error al procesar el código."
        }).then((result) => {
          if (result.isConfirmed) {
            handleCleanup();
          }
        });
        return { success: false, message: response.message || "Error en la solicitud.", validation: false };
      }
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
      handleCleanup();
      return { success: false, message: `Request failed: ${error}`, validation: false };
    }
  } else {
    handleCleanup();
    return { success: false, message: "No se proporcionó ningún código.", validation: false };
  }
}