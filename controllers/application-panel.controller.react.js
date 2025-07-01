async function getApplicationPanelContent(req) {
    console.log(req.session.headImage)

    const urlScriptLogin = `
    `;
    const htmlHeadApplicationPanel = `
        <div class="head_web" id="head-web" style="background: none;">
            <div class="container_head" id="container-head">
                <a class="container_head_image_logo" href="https://hidrasmart-mainselector.azurewebsites.net/"
                    target="_blank">
                    <img class="head_image_logo"
                        src="https://dev.azure.com/Hidralab/HidraSmart-Common_File/_apis/git/repositories/HidraSmart-Common_File/items?path=%2Fimages%2Flogo_water_texture.png">
                </a>
                <div class="head_image_services_container">
                    <a class="head_image_services_subcontainer" href="/panel-aplicaciones">
                        <img class="head_image_services" src="/images/login/IS-positivo-horizontal.png">
                    </a>
                    <div> include('./navbar.ejs') </div>
                </div>
                <div class="head_image_logo_location_container">
                    <div class="head_button_container">
                        <a id="button-log-out">
                            <img class="head_image_button_logout" title="Mi Perfil"
                                src="/images/head/icon/icon_profile.png">
                        </a>
                    </div>
                    <div class="head_button_container">
                        <a id="button-sinac" target="_blank" href="https://www.saihguadiana.com/Z12/E1-01/DATOS">
                            <span class="head_text_button_sinac">SAIH</span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
        <div id="container-profile" class="container_profile">
            <div id="profile-head" class="profile_head">
                <a id="profile-head-left" class="profile_head_left">
                    <div> headComunityName </div>
                </a>
                <a id="profile-head-right" class="profile_head_right" href="#">
                    Cerrar Sesión
                </a>

            </div>
            <div id="profile-body" class="profile_body">
                <a id="profile-body-left" class="profile_body_left" target="_blank" href="<%= headComunityUrl %>">
                    <img id="profile-image-logo-location" class="profile_image_logo_location" src="<%= headComunityLogo %>">
                </a>
                <div id="profile-body-right" class="profile_body_right">
                    <div id="profile-body-right-name" class="profile_body_right_name">
                        <div> profileUserName </div>
                    </div>
                    <div id="profile-body-right-email" class="profile_body_right_email">
                        <div> profileUserEmail </div>
                    </div>
                </div>
            </div>
                <button id="config-button">Configuración</button>
        </div>
        <!-- Fin cabecera -->

        <title>
            <%= pageTitle %>
        </title>
    `;
    const htmlBodyApplicationPanel = `
        <div>Panel de Aplicaciones Enrutado</div>
    `;
    return {
        title: 'Panel de Aplicaciones',
        sectionTitle: 'Inicio de Sesión',
        headApplicationPanelHTML: htmlHeadApplicationPanel,
        bodyApplicationPanelHTML: htmlBodyApplicationPanel,
        scriptLoginURL: urlScriptLogin,
        headImage: '/images/login/IS-positivo-horizontal.png',
        mode: ''
    };
}

module.exports = { getApplicationPanelContent };