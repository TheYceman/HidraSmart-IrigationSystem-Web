// Función para obtener el commit más reciente de un archivo en un repositorio de Github
async function obtenerCommitMasReciente(owner, repo, rutaArchivo) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${rutaArchivo}&per_page=1`;
        const response = await fetch(url);
        const commits = await response.json();

        if (commits.length > 0) {
            return commits[0].sha;
        } else {
            throw new Error('No se encontraron commits para el archivo especificado.');
        }
    } catch (error) {
        throw new Error('Error al obtener el commit más reciente: ' + error.message);
    }
}

module.exports = obtenerCommitMasReciente;