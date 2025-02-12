


const fetch = require('node-fetch');

const obtenerCommitMasReciente  = require("../public/scripts/get-latest-commit");


async function getLogin(req, res) {
    // req.session.headImage = '/images/login/US-positivo-horizontal.png';

    try {
        
        const owner = 'HidralabIyD';
        const repo = 'HidraSmart-CommonFiles';
        const rutaHeadLogin = 'components/head-login.html';
        const rutaBodyLogin = 'components/body-login.html';
        const rutaScriptLogin = 'scripts/login.js';

        let commitShaHeadLogin, commitShaBodyLogin, commitShaScriptLogin;
        let htmlHeadLogin, htmlBodyLogin;

        try {
            // Obtener el commit más reciente del archivo head-login.html
            commitShaHeadLogin = await obtenerCommitMasReciente(owner, repo, rutaHeadLogin);
        } catch (error) {
            console.error('Error al obtener el commit más reciente:', error.message);
        }

        // Si se obtuvo correctamente el commit más reciente, construir la URL con la SHA del commit
        if (commitShaHeadLogin) {
            urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaHeadLogin}/${rutaHeadLogin}`;
        } else {
            // Si hubo un error o no se encontró ningún commit, intentar obtener el archivo directamente desde la rama principal
            urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaHeadLogin}`;
        }
        
        // Obtener el contenido del archivo head-login.html
        const responseHeadLogin = await fetch(urlHeadLogin);
        htmlHeadLogin = await responseHeadLogin.text();

        try {
             // Obtener el commit más reciente del archivo body-login.html
            commitShaBodyLogin = await obtenerCommitMasReciente(owner, repo, rutaBodyLogin);
        } catch (error) {
            console.error('Error al obtener el commit más reciente:', error.message);
        }

        // Si se obtuvo correctamente el commit más reciente, construir la URL con la SHA del commit
        if (commitShaBodyLogin) {
            // Construir la URL con la SHA del commit más reciente
            urlBodyLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaBodyLogin}/${rutaBodyLogin}`;
        } else {
            // Si hubo un error o no se encontró ningún commit, intentar obtener el archivo directamente desde la rama principal
            urlBodyLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaBodyLogin}`;
        }


        // Obtener el contenido del archivo head-login.html
        const responseBodyLogin = await fetch(urlBodyLogin);
        htmlBodyLogin = await responseBodyLogin.text();

        try {
            // Obtener el commit más reciente del archivo head-login.html
            commitShaScriptLogin = await obtenerCommitMasReciente(owner, repo, rutaScriptLogin);
       } catch (error) {
           console.error('Error al obtener el commit más reciente:', error.message);
       }

       // Si se obtuvo correctamente el commit más reciente, construir la URL con la SHA del commit
       if (commitShaScriptLogin) {
            // Construir la URL con la SHA del commit más reciente
            urlScriptLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaScriptLogin}/${rutaScriptLogin}`;
       } else {
            // Si hubo un error o no se encontró ningún commit, intentar obtener el archivo directamente desde la rama principal
            urlScriptLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaScriptLogin}`;
       }

        
       htmlBodyLogin = `<div id="container-master-login" class="container_master_login">
                            <form id="form-login" class="form_login" >
                                <div class="box_img_security">
                                    <img class="img_security" src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/images/image_security_white_izquierda.png">
                                </div>
                                <div class="container_body">
                                    <div id="container-subcontainers-input" class="container_subcontainers_input">
                                        <div class="subcontainer_email">
                                            <div class="subcontainer_input_email">
                                                <a id="label-subcontainer-input-email" class="label_subcontainer_input_email red_label" href="">Usuario*</a>
                                                <div class="container_img_email">
                                                    <img class="img_email" src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/icon_user.png" width="32" height="25">
                                                </div>
                                                <input type="text" name="username" id="input-email" class="input_email" placeholder="Usuario*" required onfocus="applyRedBorder('email');" onblur="if(this.value=='') addImportantWarning('email'); else removeImportantWarning('email'); removeRedBorder('email');" />
                                            </div>
                                            <div id="container-text-input-email" class="container_text_input_email">
                                                <a id="text-informative-notice-email" class="text_informative_notice_email" href="" tabindex="-1">Alias asociado al usuario</a>
                                                <a id="text-important-warning-email" class="text_important_warning_email concealment" href="" tabindex="-1">El alias es obligatorio</a>
                                            </div>
                                        </div>
                                        <div class="subcontainer_pass">
                                            <div class="subcontainer_input_pass">
                                                <a id="label-subcontainer-input-pass" class="label_subcontainer_input_pass red_label" href="">Contraseña*</a>
                                                <div class="container_img_pass">
                                                    <img class="img_pass" src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/icon_pass.png" width="32" height="25">
                                                </div>
                                                <input type="password" name="password" id="input-pass" class="input_pass" placeholder="Contraseña*" required onfocus="applyRedBorder('pass');" onblur="if(this.value=='') addImportantWarning('pass'); else removeImportantWarning('pass'); removeRedBorder('pass');" />
                                            </div>
                                            <div id="container-text-input-pass" class="container_text_input_pass">
                                                <a id="text-informative-notice-pass" class="text_informative_notice_pass" href="" tabindex="-1">Contraseña asociada al usuario</a>
                                                <a id="text-important-warning-pass" class="text_important_warning_pass concealment" href="" tabindex="-1">La contraseña es obligatoria</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bottom_container_body">
                                        <div id="container-help-links" class="container_help_links">
                                            <a id="text-technical-support-contact" class="text_technical_support_contact" href="/contact-us">Soporte técnico y contacto</a>
                                            <a id="text-forgot-password" class="text_forgot_password" >He olvidado mi contraseña</a>
                                        </div>
                                        <button id="loginButton" class="btn_login" type="button" onclick="login()"
                                            data-sitekey="6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX"
                                            data-callback='login'
                                            data-action='submit'>
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                    <div class="container_app_store">
                                        <p id="title-download-zone" class="title_download_zone">Descargas</p>
                                        <div id="download-zone" class="download_zone">
                                            <img class="img_qr" src="/images/icons/qr-irrigation-system.svg" alt="Descripción de la imagen">
                                            <div class="bottom_container_app_store">
                                                <a id="url-google-play"" class="url_app_store"" href="/">
                                                    <img class="img_app_store" src="/images/icons/Button-Google-Play.png">
                                                </a>
                                                <a id="url-app-store"" class="url_app_store"" href="/">
                                                    <img class="img_app_store" src="/images/icons/Button-App-Store.png">
                                                </a>
                                            </div>
                                        </div
                                    </div>
                                </div>
                            </form>
                        </div>`
        
        
        // Renderizar la vista y enviar el contenido obtenido
        res.render('login', { 
          headLoginHTML: htmlHeadLogin,
          bodyLoginHTML: htmlBodyLogin,
          scriptLoginURL: urlScriptLogin,
          headImage: ('/images/login/IS-positivo-horizontal.png'),
          title:'Login',
          sectionTitle: 'Inicio de Sesión',
          mode: ''
        });
    } catch (error) {
        console.error('Error al obtener contenido externo:', error);
        res.status(500).send('Error al obtener contenido externo');
    }
}

module.exports = { getLogin };