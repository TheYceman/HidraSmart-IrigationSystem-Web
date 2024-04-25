
// Configurar mixins para SweetAlert
const fadeMixinNotTime = Swal.mixin({
    icon: 'warning',
    title: 'General Title',
    animation: false,
    showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
    },
    hideClass: {
        popup: 'animated fadeOutUp faster',
    },
    customClass: {
        popup: 'custom-dialog-class'
    }
});

// Función para abrir mensajes en popups's generales
function showMessage(image, message) {
    fadeMixinNotTime.fire({
        icon: "",
        title: `<img class="img_show_message" src="` + image + `" width="60" height="60">`,
        html: `<p>` + message + `</p>`,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "ACEPTAR",
        confirmButtonColor: "#3a677c",
        customClass: {
            confirmButton: 'custom-confirm-button-class'
        },
    });
}
