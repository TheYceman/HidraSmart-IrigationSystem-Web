const obtenerCommitMasReciente = require('../public/scripts/get-latest-commit');

async function getLoginContent() {
  const owner = 'HidralabIyD';
  const repo = 'HidraSmart-CommonFiles';

  const rutaScriptLogin = 'scripts/login.js';

  let commitShaScriptLogin;
  let htmlHeadLogin = '', htmlBodyLogin = '', urlScriptLogin = '';

  // HEAD LOGIN
  htmlHeadLogin = `
    <!-- Inicio cabecera -->
    <div class="head_web" id="head-web"style="background: none;">
        <div class="container_head" id="container-head">
            <a href="https://hidrasmart-mainselector.azurewebsites.net/">
                <img class="head_image_logo" src = "https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/images/logo_water_texture.png">
            </a>
            <a class="head_image_services_container" href="/">
                <img id="head-image-services" class="head_image_services" src = "/images/login/IS-positivo-horizontal.png"> 
            </a>
            </div>
        </div>
    </div>
    <!-- Fin cabecera -->
    <!-- Inicio label Inicio de Sesión-->
        <h2 class="titulo_seccion" id="titulo-seccion">
            <p id="section-title">Inicio de Sesión</p>
        </h2>
    <!-- Fin label Inicio de Sesión-->
    `;
  // SCRIPT LOGIN
  try {
    commitShaScriptLogin = await obtenerCommitMasReciente(owner, repo, rutaScriptLogin);
    urlScriptLogin = commitShaScriptLogin
      ? `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaScriptLogin}/${rutaScriptLogin}`
      : `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaScriptLogin}`;
  } catch (err) {
    console.error('[LoginReact] Error cargando script-login:', err.message);
  }


  htmlBodyLogin = 
    `
      <div id="container-master-login" class="container_master_login">
        <form id="form-login" class="form_login">
          <div class="box_img_security">
            <img
              class="img_security"
              src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/images/image_security_white_izquierda.png"
              alt=""
            />
          </div>

          <div class="container_body">
            <div class="container_subcontainers_input">
              <div class="subcontainer_email">
                <div class="subcontainer_input_email">
                  <a id="label-subcontainer-input-email" class="label_subcontainer_input_email red_label" href="">Usuario*</a>
                  <div class="container_img_email">
                    <img
                      class="img_email"
                      src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/icon_user.png"
                      width="32"
                      height="25"
                    />
                  </div>
                  <input
                    type="text"
                    id="input-email"
                    class="input_email"
                    placeholder="Usuario*"
                    required
                  />
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
                    <img
                      class="img_pass"
                      src="https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/icon_pass.png"
                      width="32"
                      height="25"
                    />
                  </div>
                  <input
                    type="password"
                    id="input-pass"
                    class="input_pass"
                    placeholder="Contraseña*"
                    required
                  />
                </div>
                <div id="container-text-input-pass" class="container_text_input_pass">
                  <a id="text-informative-notice-pass" class="text_informative_notice_pass" href="" tabindex="-1">Contraseña asociada al usuario</a>
                  <a id="text-important-warning-pass" class="text_important_warning_pass concealment" href="" tabindex="-1">La contraseña es obligatoria</a>
                </div>
              </div>
            </div>

            <div class="bottom_container_body">
              <div class="container_help_links">
                <a class="text_technical_support_contact" href="/contact-us">
                  Soporte técnico y contacto
                </a>
                <a class="text_forgot_password" href="#">
                  He olvidado mi contraseña
                </a>
              </div>
              <button id="loginButton" class="btn_login" type="button" onclick="login(event)" data-sitekey="6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX" data-callback="login" data-action="submit">
                  Iniciar Sesión
              </button>
            </div>

            <div class="container_app_store">
              <p class="title_download_zone">Descargas</p>
              <div class="download_zone">
                <img class="img_qr" src="/images/icons/qr-irrigation-system.svg" alt="QR descarga app" />
                <div class="bottom_container_app_store">
                  <a class="url_app_store" href="https://play.google.com/store/apps/details?id=com.hidralab.hidrasmart_irrigation_system&hl=es_419">
                    <img class="img_app_store" src="/images/icons/Button-Google-Play.png" alt="Google Play" />
                  </a>
                  <a class="url_app_store" href="https://apps.apple.com/es/app/irrigation-system/id6742543776">
                    <img class="img_app_store" src="/images/icons/Button-App-Store.png" alt="App Store" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;

  return {
    title: 'Login',
    sectionTitle: 'Inicio de Sesión',
    headLoginHTML: htmlHeadLogin,
    bodyLoginHTML: htmlBodyLogin,
    scriptLoginURL: urlScriptLogin,
    headImage: '/images/login/IS-positivo-horizontal.png',
    mode: ''
  };
}

module.exports = { getLoginContent };