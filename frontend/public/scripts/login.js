var fadeMixinNotTime = typeof fadeMixinNotTime === 'undefined' ? Swal.mixin({
  icon: "warning",
  title: "General Title",
  animation: false,
  showClass: {
    popup: "animated fadeInDown faster",
    icon: "animated heartBeat delay-1s",
  },
  hideClass: {
    popup: "animated fadeOutUp faster",
  },
  customClass: {
    popup: "custom-dialog-class",
  },
}) : fadeMixinNotTime;

document.addEventListener("DOMContentLoaded", () => {
  // Agregar eventos de enfoque y desenfoque a los inputs
  inputEmail.addEventListener("focus", () => {
    applyRedBorder("email");
  });
  inputEmail.addEventListener("blur", () => {
    if (inputEmail.value === "") {
      addImportantWarning("email");
    } else {
      removeImportantWarning("email");
      removeRedBorder("email");
    }
  });
  inputPass.addEventListener("focus", () => {
    applyRedBorder("pass");
  });
  inputPass.addEventListener("blur", () => {
    if (inputPass.value === "") {
      addImportantWarning("pass");
    } else {
      removeImportantWarning("pass");
      removeRedBorder("pass");
    }
  });
});

function applyRedBorder(element) {
  var contentElemen = document.querySelector(".subcontainer_input_" + element);
  contentElemen.classList.add("red_border");
  var labelElement = document.querySelector(
    ".label_subcontainer_input_" + element
  );
  labelElement.classList.remove("red_label");
  var inputElemen = document.querySelector(".input_" + element);
  inputElemen.classList.add("red_text");
}

function removeRedBorder(element) {
  var contentElemen = document.querySelector(".subcontainer_input_" + element);
  contentElemen.classList.remove("red_border");
  var labelElement = document.querySelector(
    ".label_subcontainer_input_" + element
  );
  labelElement.classList.add("red_label");
  var inputElement = document.querySelector(".input_" + element);
  inputElement.classList.remove("red_text");
}

function addImportantWarning(element) {
  var contentElement = document.querySelector(
    ".text_important_warning_" + element
  );
  contentElement.classList.remove("concealment");
}

function removeImportantWarning(element) {
  var contentElement = document.querySelector(
    ".text_important_warning_" + element
  );
  contentElement.classList.add("concealment");
}

function validarFormulario() {
  var passwordInput = document.getElementById("input-pass");
  var emailInput = document.getElementById("input-email");

  if (emailInput.value === "") {
    addImportantWarning("email");
    emailInput.focus();
    return false;
  } else if (passwordInput.value === "") {
    addImportantWarning("pass");
    passwordInput.focus();
    return false;
  } else if (emailInput.value !== "admin" || passwordInput.value !== "admin") {
    fadeMixinNotTime.fire({
      icon: "",
      title:
        '<img class="img_login_error" src="public/images/icons/login_error.png" width="60" height="60">',
      html: `<p style="font-size: 1.2em; text-align: center;">Email y/o contraseña no son válidos</p>`,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "ACEPTAR",
      confirmButtonColor: "#3a677c",
    });
    return false;
  }
  return true;
}

async function testLogin() {
  let response;
  try {
    response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "prueba email",
        password: "prueba password",
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    console.log(error);
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    console.log(error);
    return;
  }
}

function bbddSelector(selector) {
  let inputGroups;
  let selectedOption = null;
  fadeMixinNotTime.fire({
    icon: "",
    title:
      'Selecciona localidad',
    html: selector,
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: "ACEPTAR",
    confirmButtonColor: "#3a677c",
    customClass: {
      confirmButton: 'custom-confirm-button-class'
    },
    didOpen: () => {
      inputGroups = document.querySelectorAll('.inputGroup');
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedOption = null;
      Array.from(inputGroups).forEach(inputGroup => {
        const input = inputGroup.querySelector('input');
        if (input.checked) {
          selectedOption = input.value;
        }
      });
      if (!selectedOption) throw failedLogin('No ha seleccionado ninguna población.');
      else {
        let saveLocationOptionResult = await fetch(
          `/api/save-location-option`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedOption }),
          }
        );
        console.log('saveLocationOptionResult:');
        console.log(saveLocationOptionResult);
        if (saveLocationOptionResult.ok) {
          const responseData = await saveLocationOptionResult.json();
          if (responseData.success) {
            window.location.href = responseData.route;
          } else {
            failedLogin('Carece de permisos.<br>Póngase en contacto con el SAT.');
            clearImputsLogin();
          }
        } else {
          console.error('Error al enviar la opción al servidor');
        }
      }
    }
  });
}


async function login(event) {
  if (event) event.preventDefault();
  const emailInput = document.getElementById("input-email");
  const passwordInput = document.getElementById("input-pass");
  const token = await grecaptcha.enterprise.execute('6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX', { action: 'login' });

  if (emailInput.value === "" || passwordInput.value === "") {
    fadeMixinNotTime.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos.",
      confirmButtonText: "Aceptar",
    });
    return;
  }
  try {
    const response = await fetch("/api/loginReact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: emailInput.value,
        password: passwordInput.value,
        token: token,
      }),
    });


    const data = await response.json();

    if (data.success) {
      if (data.user.two_factor_enabled == 1) {

        const sendingemail = data.user.email;
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
          if (data.user.namenetwork === 'full') {
            bbddSelector(data.html);
          }
          // fadeMixinNotTime.fire({
          //   icon: "success",
          //   title: "Inicio de sesión exitoso",
          //   text: "Bienvenido de nuevo, " + data.username,
          //   confirmButtonText: "Aceptar",
          // }).then(() => {
          //   if (typeof window.onLoginSuccess === "function") {
          //     window.onLoginSuccess();
          //   }
          // });
        }
      } else {
        if (data.user.namenetwork === 'full') {
          bbddSelector(data.html);
        }
        // fadeMixinNotTime.fire({
        //   icon: "success",
        //   title: "Inicio de sesión exitoso",
        //   text: "Bienvenido de nuevo, " + data.username,
        //   confirmButtonText: "Aceptar",
        // }).then(() => {
        //   if (typeof window.onLoginSuccess === "function") {
        //     window.onLoginSuccess();
        //   }
        // });
      }
    } else {
      fadeMixinNotTime.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: data.message || "Email y/o contraseña no son válidos",
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonText: "Aceptar",
    });
  }
}