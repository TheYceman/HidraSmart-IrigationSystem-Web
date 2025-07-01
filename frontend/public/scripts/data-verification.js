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
  } /*else {
    const errorResponse = await sendingResult.json();
    const errorMessage = errorResponse.message;
    console.error(errorMessage);
  }*/
}

async function showMessageCodeRequest(sendingemail, sendingtype, sendingvalue, icon) {
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
