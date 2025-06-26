const { insertSessionLog } = require("../controllers/session.controller");
const { getPermits } = require("../data/get-permits");

const Network = require('../models/network.model');
const UserPermission = require('../models/user-permission.model');
const Permissions = require('../models/permission.model');

async function getUserLocationOption(req, res) {
    try {
        let networks = await getUserNetworks(req.session.user[0].idusers);
        req.session.user[0].networks = networks; // Guardar las redes en la sesión del usuario
        if (networks.length === 0) {
            return res.status(401).json({ success: false, message: 'No tiene redes asignadas.' });
        }

        if (networks.length === 1) {            // ✅ Si solo hay una red, asignamos directamente
            req.session.user[0].ddbbSelected = networks[0];
            req.session.user[0].namenetwork = networks[0];
            req.session.token = req.sessionID;
            req.session.headImage = '/images/login/US-positivo-horizontal.png';
            process.env.USER_SESSION = JSON.stringify(req.session.userSession);

            if (req.session.user[0].idusers) {
                insertSessionLog(req.sessionID, req.session.user[0].idusers, process.env.NODE_ENV);
            } else {
                console.error('Alguno de los valores necesarios para insertar la sesión es undefined.');
            }

            let resultPermits = await getPermits(req.session.user[0].idusers, networks[0]);
            await dataCollected(req, req.session.user[0].namenetwork);
            //await htmlNavbarController(req, resultPermits);
            return res.status(200).json({
                success: true,
                route: req.session.initRoute,
                user: req.session.user[0]
            });

        } else {
            req.session.user[0].namenetwork = "full";
            // ✅ Si hay más de una red, mostrar el selector
            req.session.token = req.sessionID;
            req.session.headImage = '/images/login/US-positivo-horizontal.png';
            process.env.USER_SESSION = JSON.stringify(req.session.userSession);

            if (req.session.user[0].idusers) {
                insertSessionLog(req.sessionID, req.session.user[0].idusers, process.env.NODE_ENV);
            } else {
                console.error('Alguno de los valores necesarios para insertar la sesión es undefined.');
            }

            // ✅ Generar HTML del selector de redes
            const htmlAdminSelector = generateNetworkSelectorHtml(networks) + getNetworkSelectorStyles();
            return res.status(200).json({
                success: true,
                route: req.session.initRoute,
                user: req.session.user[0],
                html: htmlAdminSelector
            });
        }

    } catch (error) {
        console.error("Error en getUserLocationOption:", error);
        return null;
    }
}

// async function htmlNavbarController(req, rawPermissions) {
//     const image = `/images/login/login_error.png`;
//     const message = `No Disponible`;

//     // Obtener los IDs de los permisos asociados a cada módulo
//     const permissionIds = rawPermissions.flatMap(group => Object.values(group).slice(1));

//     // Obtener los detalles de los permisos
//     const permissionsDetails = await Permissions.findAll({
//         attributes: ['id', 'level', 'name'],
//         where: { id: permissionIds },
//         raw: true
//     });

//     if (!permissionsDetails || permissionsDetails.length === 0) {
//         console.error('No se encontraron detalles en permissions.');
//         return { success: false, permits: {} };
//     }

//     // Transformar el resultado en un objeto estructurado
//     const structuredPermissions = {};
//     permissionsDetails.forEach(perm => {
//         const moduleKey = perm.name.replace(/^(full_|na_|hidden_)/, '');
//         structuredPermissions[moduleKey] = perm.level;
//     });

//     const permissions = structuredPermissions || {}; 

//     // Navbar dinámico según permisos
//     const htmlNavbar = `
//     <section>
//         <div id="option-selector">
//             <ul id="nav-inicio-options" class="menu-options">
//                 ${getNavItem('Gestor de Consumos', '/gestor-equipos', permissions, 'equipos')}
//                 ${getNavItem('Gestor de Activos', '/gestor-activos', permissions, 'activos')}
//                 ${getNavItem('Gestor de Red', '/gestor-red', permissions, 'red')}
//                 ${getNavItem('Gestor de Válvulas', '/gestor-valvulas', permissions, 'valvulas')}
//                 ${getNavItem('Simulador', '/simulador', permissions, 'simulador')}
//             </ul>
//         </div>
//     </section>
//     `;
//     req.session.htmlNavbar = htmlNavbar;

//     // Panel de Aplicaciones dinámico
//     const htmlApplicationPanel = `
//         <div id="drag-container">
//             <div id="spin-container">
//                 ${getAppCard('Gestor de Consumos', '/gestor-equipos', '/images/application-panel/equipment-manager.gif', permissions, 'equipos')}
//                 ${getAppCard('Gestor de Activos', '/gestor-activos', '/images/application-panel/asset-manager.gif', permissions, 'activos')}
//                 ${getAppCard('Gestor de Red', '/gestor-red', '/images/application-panel/network-manager.gif', permissions, 'red')}
//                 ${getAppCard('Gestor de Válvulas', '/gestor-valvulas', '/images/application-panel/valve-manager.gif', permissions, 'valvulas')}
//                 ${getAppCard('Simulador', '/simulador', '/images/application-panel/simulator.gif', permissions, 'simulador')}
                
//                 <!-- Logo central -->
//                 <div class="img_centro">
//                     <a href="https://www.hidralab.com/" target="_blank">
//                         <img src="/images/SelectorAplicaciones/h-hidralab.png" alt=""/>
//                     </a>
//                 </div>
//             </div>
//             <div id="ground"></div>
//         </div>
//     `;
//     req.session.htmlApplicationPanel = htmlApplicationPanel;
// }

async function saveLocationOption(req, res) {
    try {
        const { selectedOption } = req.body;
        
        if (!selectedOption) {
            return res.status(400).json({ success: false, error: 'No se proporcionó ninguna opción' });
        }

        req.session.user[0].ddbbSelected = selectedOption;
        const resultPermits = await getPermits(req.session.user[0].idusers, selectedOption);

        if (resultPermits.permits !== '000000') {
            req.session.user[0].permits = resultPermits[0];

            //await htmlNavbarController(req, resultPermits);

            await dataCollected(req, selectedOption);

            return res.status(200).json({ 
                success: true, 
                route: req.session.initRoute, 
                navbar: req.session.htmlNavbar, 
                applicationPanel: req.session.htmlApplicationPanel 
            });
        } else {
            return res.status(200).json({ 
                success: false, 
                message: 'Carece de permisos.<br>Póngase en contacto con el SAT.' 
            });
        }
    } catch (error) {
        console.error("Error en saveLocationOption:", error);
        return res.status(500).json({ error: 'Error al procesar la selección de red' });
    }
}

function getNetworkSelectorStyles() {
    return `
        <style>
                            .swal2-popup.swal2-modal{
                                width: 30% !important;
                            }

                            .swal2-title {
                                height: 30%;
                                padding: 20px;
                            }

                            .swal2-html-container{
                                flex-direction: column;
                                width: 100% !important;
                                align-items: stretch;
                            }

                            .inputGroup {
                                background-color: #fff;
                                display: flex;
                                margin: 10px;
                                width: 85%;
                                
                                label {
                                    padding: 12px 30px;
                                    width: 100%;
                                    display: block;
                                    text-align: left;
                                    color: #3c454c;
                                    cursor: pointer;
                                    position: relative;
                                    z-index: 2;
                                    transition: color 200ms ease-in;
                                    overflow: hidden;
                                    border-radius: 28px;
                              
                                    &:before {
                                        width: 10px;
                                        height: 10px;
                                        border-radius: 50%;
                                        content: "";
                                        background-color: #009BDB;
                                        position: absolute;
                                        left: 50%;
                                        top: 50%;
                                        transform: translate(-50%, -50%) scale3d(1, 1, 1);
                                        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                                        opacity: 0;
                                        z-index: -1;
                                    }
                              
                                    &:after {
                                        width: 32px;
                                        height: 32px;
                                        content: "";
                                        border: 2px solid #d1d7dc;
                                        background-color: #fff;
                                        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
                                        background-repeat: no-repeat;
                                        background-position: 2px 3px;
                                        border-radius: 50%;
                                        z-index: 2;
                                        position: absolute;
                                        right: 6px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        cursor: pointer;
                                        transition: all 200ms ease-in;
                                    }
                                }
                              
                                input:checked ~ label {
                                    color: #fff;
                                
                                    &:before {
                                        transform: translate(-50%, -50%) scale3d(56, 56, 1);
                                        opacity: 1;
                                    }
                                
                                    &:after {
                                        background-color: #60CFFF;
                                        border-color: #60CFFF;
                                    }
                                }
                              
                                input {
                                    width: 32px;
                                    height: 32px;
                                    order: 1;
                                    z-index: 2;
                                    position: absolute;
                                    right: 30px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    cursor: pointer;
                                    visibility: hidden;
                                }
                            }
                            .swal2-actions {
                                width: 100%!important;
                            }
                            .circular-button {
                                width: 10%; /* Ajusta el tamaño de la imagen */
                                height: 4%;
                                background: rgba(255, 255, 255, 0) url(/images/fondo-sinac-claro.jpg) no-repeat center center;
                                border-radius: 50%;
                                position: absolute;
                                right: 18px; /* Ajusta la distancia desde el borde derecho */
                                top: 93%; /* Ajusta la posición vertical */
                                transform: translateY(-50%);
                                color: rgba(0, 0, 0, 0.7);
                                text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.1);
                                text-decoration: none;
                                border: solid 1px var(--color-primary-400);
                                box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.05), inset 0 0 35px rgba(0, 0, 0, 0), 0 5px 5px -4px rgba(0, 0, 0, 0.8);
                                cursor: pointer;
                              }
                              .popup_image_button_users {
                                top: 10px;
                                width: 10%; /* Ajusta el tamaño de la imagen */
                                height: auto;
                                border-radius: 50%; /* Para que la imagen sea circular */
                                position: absolute;
                                right: 10px;
                                cursor: pointer;
                                filter: drop-shadow(1px 1px 3px #888);
                              }
                              
                            </style>
    `;
}

function generateNetworkSelectorHtml(networks) {
    if (!networks || networks.length === 0) {
        return `<p>No hay redes disponibles.</p>`;
    }

    // Mapeo de nombres de redes
    const networkNameMap = {
        'pennarroya': 'Peñarroya',
        'argamasilla': 'Argamasilla de Alba'
    };

    const networkOptions = networks.map((network, index) => {
        // Si el nombre está en el mapeo, usa el valor formateado; si no, deja el nombre original
        const displayName = networkNameMap[network.toLowerCase()] || network;

        return `
            <div class="inputGroup">
                <input value="${network}" id="radio${index}" name="radio" type="radio"/>
                <label for="radio${index}">${displayName}</label>
            </div>
        `;
    }).join('');

    return `
        <div class="network-selector-container">
            ${networkOptions}
        </div>
    `;
}


async function getUserNetworks(userId) {
    try {
        const userNetworks = await UserPermission.findAll({
            attributes: ['id_network'],
            where: { id_users: userId },
            include: [
                {
                    model: Network,
                    attributes: ['name_network'],
                    as: 'network'
                }
            ],
            group: ['id_network'],
            raw: true,
            nest: true
        });

        return userNetworks.map(network => network.network?.name_network || 'Desconocido');
    } catch (error) {
        console.error("Error en getUserNetworks:", error);
        return [];
    }
}

async function dataCollected(req, option) {
    try {
        // Buscar la fila en la tabla 'networks' que coincida con el nombre
        const networkData = await Network.findOne({
            where: { name_network: option }  // 'alcazar' o 'corral'
        });

        if (!networkData) {
            console.error(`No se encontró la red con name_network=${option}`);
            return;
        }

        req.session.initRoute = '/panel-aplicaciones';
        req.session.headLocationLogo = networkData.logo;
        req.session.headLocationName = networkData.name;
        req.session.headLocationUrl = networkData.url;
        req.session.targetLongitude = parseFloat(networkData.longitude);
        req.session.targetLatitude = parseFloat(networkData.latitude);
        req.session.targetZoom = networkData.zoom;
        req.session.ddbb = networkData.bbdd_datos;

    } catch (error) {
        console.error("Error en dataCollected:", error);
    }
}


module.exports = { getUserLocationOption, saveLocationOption };