function applyRedBorder(element) {
    var contentElemen = document.querySelector('.subcontainer_input_'+element);
    contentElemen.classList.add('red_border');
    var labelElement = document.querySelector('.label_subcontainer_input_'+element);
    labelElement.classList.remove('red_label');
    var inputElemen = document.querySelector('.input_'+element);
    inputElemen.classList.add('red_text');
}

function removeRedBorder(element) {
    var contentElemen = document.querySelector('.subcontainer_input_'+element);
    contentElemen.classList.remove('red_border');
    var labelElement = document.querySelector('.label_subcontainer_input_'+element);
    labelElement.classList.add('red_label');
    var inputElement = document.querySelector('.input_'+element);
    inputElement.classList.remove('red_text');
}

function addImportantWarning(element) {
    var contentElement = document.querySelector('.text_important_warning_'+element);
    contentElement.classList.remove('concealment');
}

function removeImportantWarning(element) {
    var contentElement = document.querySelector('.text_important_warning_'+element);
    contentElement.classList.add('concealment');
}

function validarCorreoElectronico(email) {
    // Expresión regular para validar el formato de un correo electrónico
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateForm(contactname, contactemail, contactmessage, contactPrivacyCheck){

    contentElement = document.querySelector('.text_important_warning_email');
    if(contactname===''){
        addImportantWarning('name');
        document.getElementById('input-name').focus();
        return false;
    }
    if(contactemail===''){
        addImportantWarning('email');
        contentElement.textContent = "El email es obligatorio.";
        document.getElementById('input-email').focus();
        return false;
    }
    if(!validarCorreoElectronico(contactemail)){
        addImportantWarning('email');
        contentElement.textContent = "Ingrese un email válido.";
        document.getElementById('input-email').focus();
        return false;
    }
    if(contactmessage===''){
        addImportantWarning('message');
        document.getElementById('input-message').focus();
        return false;
    }
    if(!contactPrivacyCheck.checked){
        addImportantWarning('privacy');
        console.log('No ha aceptado la política.')
        document.getElementById('privacy-check').focus();
        return false;
    }
    return true;
}

async function contactUs() {
    grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute('6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX', {action: 'CONTACT_US'});
        var contactname = document.getElementById('input-name').value;
        var contactemail = document.getElementById('input-email').value;
        var contactmessage = document.getElementById('input-message').value;
        var contactPrivacyCheck = document.getElementById('privacy-check');
        var resultValidateForm = validateForm(contactname, contactemail, contactmessage, contactPrivacyCheck);
        if(resultValidateForm) {
            let contactUsResult = await fetch(
                `/send-email`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token, contactname: contactname, contactemail: contactemail, contactmessage: contactmessage }),
                }
            );
            if (contactUsResult.ok) {
                const response = await contactUsResult.json();
                //alert(response.message);
                window.location.href ='/';
            }else{
                const errorResponse = await contactUsResult.json();
                const errorMessage = errorResponse.message;
                console.log(errorMessage);
                // failedLogin(errorMessage);
            }
        }
    });
}