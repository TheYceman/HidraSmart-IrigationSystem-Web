const fetch = require('node-fetch');

const obtenerCommitMasReciente  = require("../public/scripts/get-latest-commit");

async function getContactUsLogin(req,res){
  try {
    const owner = 'HidralabIyD';
    const repo = 'HidraSmart-CommonFiles';
    const rutaHeadLogin = 'components/head-login.html';
    const rutaBodyContactUs = 'components/contact-us.html';
    
    // Obtener el commit más reciente del archivo head-login.html
    const commitShaHeadLogin = await obtenerCommitMasReciente(owner, repo, rutaHeadLogin);

    // Construir la URL con la SHA del commit más reciente
    const urlHeadLogin = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaHeadLogin}/${rutaHeadLogin}`;
    
    // Obtener el contenido del archivo head-login.html
    const responseHeadLogin = await fetch(urlHeadLogin);
    const htmlHeadLogin = await responseHeadLogin.text();

    // Obtener el commit más reciente del archivo body-login.html
    const commitShaBodyContactUs = await obtenerCommitMasReciente(owner, repo, rutaBodyContactUs);

    // Construir la URL con la SHA del commit más reciente
    const urlBodyContactUs = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitShaBodyContactUs}/${rutaBodyContactUs}`;

    // Obtener el contenido del archivo head-login.html
    const responseBodyContactUs = await fetch(urlBodyContactUs);
    const htmlBodyContactUs = await responseBodyContactUs.text();
    
    res.render('login/contact-us', {
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