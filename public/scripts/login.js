var fadeMixinNotTime = Swal.mixin({
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

    // Evitar el envío del formulario
    return false;
  } else if (passwordInput.value === "") {
    addImportantWarning("pass");
    passwordInput.focus();

    // Evitar el envío del formulario
    return false;
  } else if (emailInput != "admin" && passwordInput.value != "admin") {
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
    // Evitar el envío del formulario
    return false;
  }

  // El formulario se enviará si todos los campos están completos
  return true;
}

async function testLogin() {
  let response;

  try {
    response = await fetch("/auth/login", {
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

  // const responseData = await response;
  // console.log(responseData);
}
