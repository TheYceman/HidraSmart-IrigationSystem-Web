


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