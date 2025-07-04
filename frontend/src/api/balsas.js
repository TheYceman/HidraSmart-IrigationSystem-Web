export async function fetchBalsasEstadoPorUsuario(idUsuario) {
  const res = await fetch(`/api/user/${idUsuario}/balsas-estado`);
  if (!res.ok) throw new Error('Error al obtener estado de las balsas');

  const balsas = await res.json();

  const nombreRedMap = {
    pennarroya: "Peñarroya",
    argamasilla: "Argamasilla"
    //Mas cambios
  };

  const balsasFormateadas = balsas.map(balsa => ({
    ...balsa,
    name_network: nombreRedMap[balsa.name_network] || balsa.name_network
  }));

  return balsasFormateadas;
}
