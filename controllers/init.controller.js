

const obtenerCommitMasReciente  = require("../public/scripts/get-latest-commit");


async function getLogin(req, res) {
   
    try {
        
        const owner = 'HidralabIyD';
        const repo = 'HidraSmart-CommonFiles';
        const rutaHeadLogin = 'components/head-login.html';
        const rutaBodyLogin = 'components/body-login.html';
        const rutaScriptLogin = 'scripts/login.js';
        
        // Obtener el commit más reciente del archivo head-login.html
        const commitShaHeadLogin = await obtenerCommitMasReciente(owner, repo, rutaHeadLogin);

        // Construir la URL con la SHA del commit más reciente
        const urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaHeadLogin}/${rutaHeadLogin}`;
        
        // Obtener el contenido del archivo head-login.html
        const responseHeadLogin = await fetch(urlHeadLogin);
        const htmlHeadLogin = await responseHeadLogin.text();


        // Obtener el commit más reciente del archivo body-login.html
        const commitShaBodyLogin = await obtenerCommitMasReciente(owner, repo, rutaBodyLogin);

        // Construir la URL con la SHA del commit más reciente
        const urlBodyLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaBodyLogin}/${rutaBodyLogin}`;

        // Obtener el contenido del archivo head-login.html
        const responseBodyLogin = await fetch(urlBodyLogin);
        const htmlBodyLogin = await responseBodyLogin.text();

        // Obtener el commit más reciente del archivo head-login.html
        const commitShaScriptLogin = await obtenerCommitMasReciente(owner, repo, rutaScriptLogin);

        // Construir la URL con la SHA del commit más reciente
        const urlScriptLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaScriptLogin}/${rutaScriptLogin}`;

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