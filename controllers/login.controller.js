const fetch = require('node-fetch');

const obtenerCommitMasReciente  = require("../public/scripts/get-latest-commit");

async function getContactUsLogin(req,res){
  try {
    const owner = 'HidralabIyD';
    const repo = 'HidraSmart-CommonFiles';
    const rutaHeadLogin = 'components/head-login.html';
    const rutaBodyContactUs = 'components/contact-us.html';

    let commitShaHeadLogin, commitShaBodyContactUs;
    let urlHeadLogin, urlBodyContactUs;

    try {
      // Obtener el commit más reciente del archivo head-login.html
      commitShaHeadLogin = await obtenerCommitMasReciente(owner, repo, rutaHeadLogin);
    } catch (error) {
        console.error('Error al obtener el commit más reciente:', error.message);
    }

    // Si se obtuvo correctamente el commit más reciente, construir la URL con la SHA del commit
    if (commitShaHeadLogin) {
        // Construir la URL con la SHA del commit más reciente
        urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaHeadLogin}/${rutaHeadLogin}`;
    } else {
        // Si hubo un error o no se encontró ningún commit, intentar obtener el archivo directamente desde la rama principal
        urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaHeadLogin}`;
    }
    
    // Obtener el contenido del archivo head-login.html
    const responseHeadLogin = await fetch(urlHeadLogin);
    const htmlHeadLogin = await responseHeadLogin.text();

    try {
      // Obtener el commit más reciente del archivo body-login.html
      commitShaBodyContactUs = await obtenerCommitMasReciente(owner, repo, rutaBodyContactUs);
    } catch (error) {
        console.error('Error al obtener el commit más reciente:', error.message);
    }

    // Si se obtuvo correctamente el commit más reciente, construir la URL con la SHA del commit
    if (commitShaBodyContactUs) {
      // Construir la URL con la SHA del commit más reciente
      urlBodyContactUs = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaBodyContactUs}/${rutaBodyContactUs}`;
    } else {
        // Si hubo un error o no se encontró ningún commit, intentar obtener el archivo directamente desde la rama principal
        urlBodyContactUs = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${rutaBodyContactUs}`;
    }

    // Obtener el contenido del archivo head-login.html
    const responseBodyContactUs = await fetch(urlBodyContactUs);
    const htmlBodyContactUs = await responseBodyContactUs.text();
    
    res.render('contact-us', {
      headLoginHTML: htmlHeadLogin,
      bodyContactUsHTML: htmlBodyContactUs,
      title: 'Contacto' , 
      sectionTitle: 'Formulario de Contacto',
    });
  } catch (error) {
    console.error('Error al obtener contenido externo:', error);
    res.status(500).send('Error al obtener contenido externo');
  }
}

function getChangePasswordLogin(req,res){
    res.render('change-password', {
      sectionTitle: 'Cambio de Contraseña',
    });
}

module.exports = { getContactUsLogin, getChangePasswordLogin };