function getDemoImagenesPresentacion() {
  let arrayDataPresentation = [
    {
      id: 1,
      sliderImages: `/images/presentacion-slider/Riego_por_surcos.jpg`,
      sliderTextHead: `Riego por surcos`,
      sliderTextInfo: `“Es un método bastante común y se utiliza en terrenos ondulados donde en la parte de arriba se encuentra el cultivo y se introduce el agua en los canales creados.”`,
    },
    {
      id: 2,
      sliderImages: `/images/presentacion-slider/Riego_por_drenaje.jpg`,
      sliderTextHead: `Riego por drenaje`,
      sliderTextInfo: `“Se utiliza para eliminar los excesos de agua acumulada para ofrecer a los cultivos las condiciones más óptimas para su desarrollo. Es un método muy eficiente, pero que requiere de una infraestructura particular.”`,
    },
    {
      id: 3,
      sliderImages: `/images/presentacion-slider/Riego_por_aspersion.jpg`,
      sliderTextHead: `Riego por aspersión`,
      sliderTextInfo: `“En este sistema el agua llega a los aspersores a través de las tuberías y se proporciona el agua a los cultivos de forma localizada imitando la lluvia.”`,
    },
    {
      id: 4,
      sliderImages: `/images/presentacion-slider/Riego_por_goteo.jpg`,
      sliderTextHead: `Riego por goteo`,
      sliderTextInfo: `“Es un método de riego localizado que suministra el agua a los cultivos en forma de gotas. Es el método más eficiente en cuanto al uso del agua.”`,
    },
    {
      id: 5,
      sliderImages: `/images/presentacion-slider/Riego_por_inundacion.jpg`,
      sliderTextHead: `Riego por inundación o sumersión`,
      sliderTextInfo: `“Es el método de riego intensivo más utilizado. Está presente en muchos casos de agricultura de regadío. Consiste en inundación completa de una parcela sin posibilidad de desagüe. Es un método más común principalmente en el cultivo de arroz.”`,
    },
  ];
  if (arrayDataPresentation.length === 0) {
    arrayDataPresentation.push({
      id: 1,
      sliderImages: "/images/logo.jpg",
    });
  }
  return arrayDataPresentation;
}

function getDemoNoticias() {
  let arrayDataPresentation = [
    {
      id: 1,
      image: `/images/noticias/new1.jpg`,
      date: `21 abril 2023`,
      title: `EL SISTEMA DE TELECONTROL DE NUESTRA COMUNIDAD, PRESENTADO COMO UN CASO DE ÉXITO EN UNA JORNADA CELEBRADA EN EL CENTRO NACIONAL DE TECNOLOGÍAS DE REGADÍOS`,
      body: `El sistema de telecontrol de nuestra Comunidad ha sido presentado como un caso de éxito en una jornada celebrada el pasado 23 de marzo en el CENTER (Centro Nacional de Tecnologías de Regadío), organizada por la subdirección general de Regadíos, Caminos Naturales e Infraestructuras del MAPA. Los avances que el telecontrol han permitido a nuestra Zona Regable fueron presentados por nuestro director Rafael Calvo-Júdici, que hizo hincapié en la importancia que este sistema adquiere en campañas de fuertes restricciones, como las dos últimas y la que se avecina. Gracias al proyecto de modernización culminado en 2009, hoy tenemos la posibilidad de contabilizar a nivel de toma, midiendo el consumo de cada agricultor en su parcela, en tiempo real. El sistema de telecontrol extrae la información de cada toma y la vuelca en la plataforma Irriweb, a través de la cual tanto el propio regante como la Comunidad tienen información exacta de ese consumo. La obtención de los datos de caudales, los volúmenes consumidos o las presiones, entre otros parámetros, permiten un control y una gestión absolutamente eficiente de los recursos hídricos, fundamental siempre, pero, aún más si cabe, en campañas de fuertes restricciones. Aunque nuestro sistema de telecontrol ya tiene catorce años, sigue representando un modelo para muchas otras comunidades, que no dejan de visitarnos para conocerlo, y en su momento fue una instalación completamente pionera en España, tanto es así que las funciones que hoy podemos desarrollar telemáticamente gracias a ese sistema con total normalidad sonaban entonces a verdadera ciencia ficción. El siguiente paso probablemente será aprovechar toda esa información a través de las nuevas tecnologías digitales de Big Data, Machine Learning, etc., en una gestión más inteligente enfocada al mayor rendimiento de los cultivos y uso más eficiente de los recursos hídricos y nutricionales.`,
    },
    {
      id: 2,
      image: `/images/noticias/new2.jpg`,
      date: `18 abril 2023`,
      title: `LA CHG APRUEBA UNA DOTACIÓN DE 700 M3/HA PARA LA PRESENTE CAMPAÑA DE RIEGOS`,
      body: `La Confederación Hidrográfica del Guadalquivir (CHG), en la sesión de la Comisión de Desembalse celebrada esta semana, ha acordado aprobar un desembalse de 385 hm3 para la campaña de riego de los cultivos del Sistema de Regulación General, al que pertenece nuestra Comunidad, lo que supone un descenso del 36% respecto al volumen desembalsado en la anterior campaña. La comisión ha autorizado igualmente una dotación 700 m3 por hectárea para los cultivos de mayor consumo de agua, lo que representa una reducción de casi el 90% respecto a su dotación concesional. También se acordó que la campaña de regadío se inicie ya y termine oficialmente el 30 de septiembre, si no cambian las circunstancias, aunque durante este mes de abril el Comité Permanente de la Comisión de Desembalse podría adoptar desembalses auxiliares para octubre, fundamentalmente para los cultivos de arboleda. Durante la Comisión, el presidente de la CHG, Joaquín Páez, informó de los malísimos datos de este año en los embalses de la cuenca del Guadalquivir, que están actualmente al 25,5%, un 36,5% menos que la media de los últimos 25 años; mientras que las precipitaciones están un 35% por debajo de la media. Se trata de una durísima campaña para todos los regantes, muy parecida a la situación de la sequía del año 1995, por lo que debemos recordar a nuestros comuneros la importancia de demostrar nuestro compromiso con el ahorro y eficiencia en el uso de agua para riego, algo que ya venimos haciendo de forma seria y responsable en los últimos años.`,
    },
    {
      id: 3,
      image: `/images/noticias/new3.jpg`,
      date: `14 abril 2023`,
      title: `LA GESTIÓN ENERGÉTICA COMO BANDERA AMBIENTAL DEL REGADÍO`,
      body: `Un año más, la gran feria de la agricultura del regadío del Valle del Guadalquivir, ExpoFare, organizada por el Ayuntamiento de Fuente Palmera (Córdoba), volvió a contar con un Encuentro de Comunidades de Regantes promovido por Feragua en el que se abordaron los temas de mayor interés para el regadío. Una de sus mesas redondas abordó la cuestión de la gestión energética en el regadío, y en ella participó el director de nuestra Comunidad, Rafael Calvo-Júdici, que centró su intervención en los beneficios que la entrada en funcionamiento de la planta solar han traído a nuestra Zona Regable, entre ellos la eliminación de la explotación de la red en dos fases, pasando a una única fase con presión alta las 24 horas; el ahorro en la factura conseguido gracias al autoconsumo y a la venta de energía y como no, no podemos obviar el beneficio medioambiental que se obtiene. En esta dirección, Rafael Calvo-Júdici señaló que el funcionamiento de la planta solar en la Comunidad está evitando la emisión de 951,6 toneladas de CO2 al año, el equivalente a lo que consiguen unos 5.700 árboles, animó a todas las comunidades a apostar por el autoconsumo a través de la generación de energías limpias y abogó por convertir la gestión energética en una bandera de la dimensión ambiental del regadío, basada en el respeto al medio. “Solo los agricultores sabemos cuánto nos importa y cuánto contribuimos con nuestra actividad a la preservación de nuestro entorno, es importante también que aprendamos a mostrarlo a la sociedad”, explicó. La suma del consumo de energía de la red y el autoconsumo se sitúan muy por debajo de la producción total de energía, y dado que la compra de energía se hace con certificados de origen de generación verde, puede afirmarse que toda la energía consumida por la Comunidad de Regantes del Valle Inferior está basada en energías limpias.`,
    },
    {
      id: 4,
      image: `/images/noticias/new4.jpg`,
      date: `11 abril 2023`,
      title: `EL RIEGO POR GOTEO SIGUE CRECIENDO EN NUESTRA ZONA REGABLE Y ASCIENDE YA HASTA EL 67% DE LA SUPERFICIE`,
      body: `La superficie dedicada a riego por goteo sigue extendiéndose en nuestra Zona y alcanza ya las 12.693 hectáreas, un 67% de la superficie total (18.945 has), frente al 62% del año pasado. Continúa y se consolida así una tendencia de crecimiento sostenido de este sistema de riego, el más eficiente de todos, lo que muestra el compromiso de nuestros comuneros con el ahorro y la eficiencia hídrica. Desde el año 2005 hasta hoy, el riego por goteo se ha duplicado, pasando de las 6.000 ha. de entonces a más del doble. Es probable que en este nuevo impulso haya influido la planificación de cultivos, condicionada por la sequía. Y a buen seguro, la finalización del sistema de dos fases de explotación permitida por la planta solar desde su puesta en funcionamiento también está influyendo en la extensión del riego por goteo.`,
    },
    {
      id: 5,
      image: `/images/noticias/new5.jpg`,
      date: `8 abril 2023`,
      title: `115 AÑOS DEL REAL DECRETO DE CONCESIÓN PARA LA PUESTA EN RIEGO DEL VALLE INFERIOR`,
      body: `En 1908 se sucedieron los acontecimientos claves en la historia fundacional de nuestra Comunidad. Así, en marzo se produjo la aprobación definitiva mediante Orden ministerial del Plan General de los Riegos del Valle Inferior, que contempla una superficie de más de 20.000 hectáreas. Y tal día como hoy, un 8 de abril, el Rey Alfonso XIII, a través de Real Decreto, autorizó al Ministerio de Fomento a la realización de las obras necesarias para la puesta en riego de la zona. De acuerdo con lo previsto en ese Decreto, y confirmándose en el compromiso de auxilio ya adquirido, 93 propietarios de terrenos, dueños de 13.000 hectáreas, formalizaron en julio la constitución del Sindicato de Auxilio.`,
    },
  ];
  if (arrayDataPresentation.length === 0) {
    arrayDataPresentation.push({
      id: 1,
      sliderImages: "/images/logo.jpg",
    });
  }
  return arrayDataPresentation;
}

function getDemoServicios() {
  let arrayServicios = [
    {
      title: "Distribución del Agua",
      information: `El objetivo fundamental de la Comunidad de Regantes del Canal de Hidralab es la captación y distribución del agua para el regadío entre todos los miembros y hectáreas que componen su Comunidad, para lo cual desarrolla diferentes servicios encomendados a esta misión. 

        Así, además de velar por el buen funcionamiento y la mejora continua de sus sistemas de riego, a través de la modernización y la implementación de medidas que contribuyan a la optimización de dichas infraestructuras, promueve y desarrolla otras acciones como un servicio de asesoramiento en cuestiones relacionadas con el manejo adecuado del riego, o el uso eficiente e inteligente de los recursos hídricos, este último de manera especial en situaciones de prealerta de los embalses y pantanos o ante años de dificultad hidrológica. 

        Además, fomenta la aplicación de nuevas tecnologías de riego como máxima para lograr el máximo aprovechamiento del agua, (logrando así el beneficio individual pero también el colectivo de la Comunidad), la planificación de cultivos según el momento hídrico y la disponibilidad de agua (reduciendo así el consumo en ciclos secos) o el ajuste de las dotaciones del riego a las necesidades de cada cultivo y en cada momento. 

        Igualmente se encarga de velar por el justo reparto del agua entre todos sus asociados, mediando ante las cuestiones o problemas que puedan plantearse, además de ejercer como representante de todos ellos y defensor de sus derechos ante las administraciones públicas y órganos competentes del agua.`,
      image: "/images/servicios/distribucion_agua.webp",
      color: "#009BDB",
    },
    {
      title: "Eficiencia Energética",
      information: `El uso eficiente de los recursos energéticos se ha convertido en una de las principales prioridades de nuestra Comunidad en los últimos años, sobre todo tras el proceso de modernización de los sistemas de riego y los cambios en el sistema de tarifa eléctrica, que ha ocasionado un aumento del consumo asociado a estas inversiones en nuevas infraestructuras, en todas las comunidades de regantes en general.

        Es por ello por lo que nuestra Comunidad ha venido desarrollando un sólido plan estratégico para lograr una mejor gestión de los recursos energéticos, lo que le ha permitido situarse como un referente en cuanto al uso eficiente de la energía a nivel regional y nacional. 

        Entre las acciones y servicios desarrollados en este ámbito destacan:

         - El impuso a la Central de Compras de Energía de Fenacore y Feragua para la optimización de la compra de energía y la reducción de sus costes.

         - La optimización de las potencias de electricidad contratadas, adaptando la contratación a las necesidades reales del riego y los cultivos.

         - La incorporación de las dos fases de explotación del sistema de regadío durante la Campaña de Riegos, una nocturna y otra diurna, para el ahorro energético (que alcanza el 22%).

         - El mantenimiento, control y seguimiento de las bombas y equipos de riego para detectar posibles fallos antes de que se produzcan y ajustar los parámetros de funcionamiento para lograr un menor consumo de energía en función de la demanda.

        Gracias a todo ello, nos hemos convertido en una de las comunidades de regantes pioneras en este campo, la que menos potencia contrata por superficie y en la que sus asociados menos pagan por la energía, según un estudio de la Universidad de Córdoba.`,
      image: "/images/servicios/eficiencia_energetica.jpg",
      color: "#4f7e0e",
    },
    {
      title: "Especies Invasoras",
      information: `          La lucha contra las especies invasoras exóticas (en especial briozoos, mejillón cebra, y almeja asiática) y su eliminación de los sistemas de riego es otra de las prioridades actuales de la Comunidad de Regantes del Canal de Hidralab, dado el importante problema que está suponiendo para la distribución del agua en nuestras infraestructuras, de manera especial durante las campañas de riego durante el verano, y el consiguiente coste asociado que está suponiendo para nuestros regantes. 

        La estrategia de la Comunidad en este sentido está incluyendo diferentes acciones que están contribuyendo a erradicar la proliferación de este tipo de especies, o minimizar al máximo sus efectos, ya que cada año llegan a través del agua de río y vuelven a desarrollarse. Así, destacan los estudios realizados para conocer mejor su origen y aparición y las actuaciones desarrolladas contra algunas de ellas, como los briozoos y el mejillón cebra, que ya están siendo sometidas a diversos tratamientos con éxito.

        En esta línea, también ofrecemos asesoramiento a nuestros regantes, con recomendaciones y consejos para realizar una importante labor de control y seguimiento de los sistemas de riego y velar por su buen funcionamiento ante la posible aparición de estas especies.

        En paralelo, estamos participando y colaborando con otras entidades y organismos autonómicos y nacionales para desarrollar estrategias, proyectos y medidas que nos permitan compartir resultados y experiencias en la lucha contra estas especies, y, en definitiva, aunar fuerzas para alcanzar su erradicación.`,
      image: "/images/servicios/especies_exoticas_invasoras.jpg",
      color: "#e4362f",
    },
  ];
  return arrayServicios;
}

function getDemoRed() {
  let arrayPropietarios = [
    {
      id: 0,
      nombre: "Pedro",
      apellidos: "González",
      telefono: "111111111",
      email: "pedro@example.com",
      direccion: "Calle Mayor 123",
      sector: "Sector A",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 1",
      parcela: "Parcela 10",
      area: "100 m²",
      tipo: "Tipo A",
      cultivo: "Cultivo 1",
      titular: "Pedro González",
    },
    {
      id: 1,
      nombre: "Ana",
      apellidos: "Sánchez",
      telefono: "222222222",
      email: "ana@example.com",
      direccion: "Avenida Central 456",
      sector: "Sector B",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 2",
      parcela: "Parcela 20",
      area: "200 m²",
      tipo: "Tipo B",
      cultivo: "Cultivo 2",
      titular: "Ana Sánchez",
    },
    {
      id: 2,
      nombre: "Luis",
      apellidos: "Martínez",
      telefono: "333333333",
      email: "luis@example.com",
      direccion: "Calle Principal 789",
      sector: "Sector C",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 3",
      parcela: "Parcela 30",
      area: "300 m²",
      tipo: "Tipo C",
      cultivo: "Cultivo 3",
      titular: "Luis Martínez",
    },
    {
      id: 3,
      nombre: "María",
      apellidos: "Gómez",
      telefono: "444444444",
      email: "maria@example.com",
      direccion: "Avenida Central 987",
      sector: "Sector D",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 4",
      parcela: "Parcela 40",
      area: "400 m²",
      tipo: "Tipo D",
      cultivo: "Cultivo 4",
      titular: "María Gómez",
    },
    {
      id: 4,
      nombre: "José",
      apellidos: "Rodríguez",
      telefono: "555555555",
      email: "jose@example.com",
      direccion: "Calle Mayor 654",
      sector: "Sector E",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 5",
      parcela: "Parcela 50",
      area: "500 m²",
      tipo: "Tipo E",
      cultivo: "Cultivo 5",
      titular: "José Rodríguez",
    },
    {
      id: 5,
      nombre: "Laura",
      apellidos: "López",
      telefono: "666666666",
      email: "laura@example.com",
      direccion: "Avenida Central 321",
      sector: "Sector F",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 6",
      parcela: "Parcela 60",
      area: "600 m²",
      tipo: "Tipo F",
      cultivo: "Cultivo 6",
      titular: "Laura López",
    },
    {
      id: 6,
      nombre: "Carlos",
      apellidos: "Fernández",
      telefono: "777777777",
      email: "carlos@example.com",
      direccion: "Calle Principal 456",
      sector: "Sector G",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 7",
      parcela: "Parcela 70",
      area: "700 m²",
      tipo: "Tipo G",
      cultivo: "Cultivo 7",
      titular: "Carlos Fernández",
    },
    {
      id: 7,
      nombre: "Sara",
      apellidos: "Pérez",
      telefono: "888888888",
      email: "sara@example.com",
      direccion: "Avenida Central 654",
      sector: "Sector H",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 8",
      parcela: "Parcela 80",
      area: "800 m²",
      tipo: "Tipo H",
      cultivo: "Cultivo 8",
      titular: "Sara Pérez",
    },
    {
      id: 8,
      nombre: "Javier",
      apellidos: "González",
      telefono: "999999999",
      email: "javier@example.com",
      direccion: "Calle Mayor 987",
      sector: "Sector I",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 9",
      parcela: "Parcela 90",
      area: "900 m²",
      tipo: "Tipo I",
      cultivo: "Cultivo 9",
      titular: "Javier González",
    },
    {
      id: 9,
      nombre: "Marta",
      apellidos: "Sánchez",
      telefono: "101010101",
      email: "marta@example.com",
      direccion: "Avenida Central 789",
      sector: "Sector J",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 10",
      parcela: "Parcela 100",
      area: "1000 m²",
      tipo: "Tipo J",
      cultivo: "Cultivo 10",
      titular: "Marta Sánchez",
    },
    {
      id: 10,
      nombre: "Daniel",
      apellidos: "García",
      telefono: "121212121",
      email: "daniel@example.com",
      direccion: "Calle Principal 123",
      sector: "Sector K",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 11",
      parcela: "Parcela 110",
      area: "1100 m²",
      tipo: "Tipo K",
      cultivo: "Cultivo 11",
      titular: "Daniel García",
    },
    {
      id: 11,
      nombre: "Isabel",
      apellidos: "López",
      telefono: "131313131",
      email: "isabel@example.com",
      direccion: "Avenida Central 123",
      sector: "Sector L",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 12",
      parcela: "Parcela 120",
      area: "1200 m²",
      tipo: "Tipo L",
      cultivo: "Cultivo 12",
      titular: "Isabel López",
    },
    {
      id: 12,
      nombre: "Juan",
      apellidos: "Hernández",
      telefono: "141414141",
      email: "juan@example.com",
      direccion: "Calle Mayor 321",
      sector: "Sector M",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 13",
      parcela: "Parcela 130",
      area: "1300 m²",
      tipo: "Tipo M",
      cultivo: "Cultivo 13",
      titular: "Juan Hernández",
    },
    {
      id: 13,
      nombre: "Carmen",
      apellidos: "Ruiz",
      telefono: "151515151",
      email: "carmen@example.com",
      direccion: "Avenida Central 321",
      sector: "Sector N",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 14",
      parcela: "Parcela 140",
      area: "1400 m²",
      tipo: "Tipo N",
      cultivo: "Cultivo 14",
      titular: "Carmen Ruiz",
    },
    {
      id: 14,
      nombre: "Antonio",
      apellidos: "Gómez",
      telefono: "161616161",
      email: "antonio@example.com",
      direccion: "Calle Principal 321",
      sector: "Sector O",
      municipio: "Argamasilla de Alba",
      poligono: "Polígono 15",
      parcela: "Parcela 150",
      area: "1500 m²",
      tipo: "Tipo O",
      cultivo: "Cultivo 15",
      titular: "Antonio Gómez",
    },
  ];
  return arrayPropietarios;
}

function getDemoUsuarios() {
  const arrayUsuarios = [
    {
      usuario: "user1@example.com",
      password: "Passw0rd!",
      nombre: "John",
      apellidos: "Doe",
      dni: "12345678A",
    },
    {
      usuario: "user2@example.com",
      password: "P@ssword123",
      nombre: "Jane",
      apellidos: "Smith",
      dni: "23456789B",
    },
    {
      usuario: "user3@example.com",
      password: "Secret123!",
      nombre: "Michael",
      apellidos: "Johnson",
      dni: "34567890C",
    },
    {
      usuario: "user4@example.com",
      password: "SecurePass1",
      nombre: "Emily",
      apellidos: "Davis",
      dni: "45678901D",
    },
    {
      usuario: "user5@example.com",
      password: "StrongP@ss",
      nombre: "David",
      apellidos: "Miller",
      dni: "56789012E",
    },
    {
      usuario: "user6@example.com",
      password: "Pass123!word",
      nombre: "Olivia",
      apellidos: "Wilson",
      dni: "67890123F",
    },
    {
      usuario: "user7@example.com",
      password: "Pa$$w0rd",
      nombre: "James",
      apellidos: "Anderson",
      dni: "78901234G",
    },
    {
      usuario: "user8@example.com",
      password: "SecurePassword123",
      nombre: "Sophia",
      apellidos: "Taylor",
      dni: "89012345H",
    },
    {
      usuario: "user9@example.com",
      password: "Passw0rd!123",
      nombre: "William",
      apellidos: "Clark",
      dni: "90123456I",
    },
    {
      usuario: "user10@example.com",
      password: "StrongPassword!",
      nombre: "Ava",
      apellidos: "Thomas",
      dni: "01234567J",
    },
    {
      usuario: "user11@example.com",
      password: "P@ssw0rd",
      nombre: "Mason",
      apellidos: "Brown",
      dni: "12345678K",
    },
    {
      usuario: "user12@example.com",
      password: "Password12!",
      nombre: "Isabella",
      apellidos: "Robinson",
      dni: "23456789L",
    },
    {
      usuario: "user13@example.com",
      password: "SecureP@ss",
      nombre: "Benjamin",
      apellidos: "Harris",
      dni: "34567890M",
    },
    {
      usuario: "user14@example.com",
      password: "Pa$$w0rd123",
      nombre: "Emma",
      apellidos: "Lee",
      dni: "45678901N",
    },
    {
      usuario: "user15@example.com",
      password: "123SecurePass!",
      nombre: "Jacob",
      apellidos: "Walker",
      dni: "56789012O",
    },
    {
      usuario: "user16@example.com",
      password: "StrongPa$$",
      nombre: "Mia",
      apellidos: "Green",
      dni: "67890123P",
    },
    {
      usuario: "user17@example.com",
      password: "P@ssw0rd123",
      nombre: "Ethan",
      apellidos: "Hall",
      dni: "78901234Q",
    },
    {
      usuario: "user18@example.com",
      password: "SecureP@ssword",
      nombre: "Oliver",
      apellidos: "Young",
      dni: "89012345R",
    },
    {
      usuario: "user19@example.com",
      password: "Passw0rd!123",
      nombre: "Avery",
      apellidos: "Scott",
      dni: "90123456S",
    },
    {
      usuario: "user20@example.com",
      password: "StrongPassword!",
      nombre: "Sofia",
      apellidos: "King",
      dni: "01234567T",
    },
  ];
  return arrayUsuarios;
}

module.exports = {
  getImagenesPresentacion: getDemoImagenesPresentacion,
  getNoticiasData: getDemoNoticias,
  getServiciosData: getDemoServicios,
  getRedData: getDemoRed,
  getUsuariosData: getDemoUsuarios,
};
