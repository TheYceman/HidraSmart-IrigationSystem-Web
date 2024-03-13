Highcharts.chart("highchart-organizacion", {
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false, //Elimina el menú de opciones
  },
  chart: {
    height: "40%",
    inverted: true,
  },
  plotOptions: {
    series: {
      animation: {
        duration: 1000,
      },
    },
  },
  title: null,
  accessibility: {
    typeDescription:
      "El organigrama muestra jerárquicamente los diferentes cargos dentro del funcionamiento de la comunidad de regantes.",
  },
  series: [
    {
      type: "organization",
      name: "Jerarquía para el Funcionamiento de la Comunidad de Regantes",
      keys: ["from", "to"],
      data: [
        ["PCR", "PJR"],
        ["PJR", "ST"],
        ["PJR", "VJR"],
        ["PJR", "VJRR1"],
        ["PJR", "VJRR2"],
        ["ST", "V"],
        ["VJR", "V"],
        ["VJRR1", "V"],
        ["VJRR2", "V"],
        ["V", "V1"],
        ["V", "V2"],
        ["V", "V3"],
        ["V", "V4"],
      ],
      levels: [
        {
          level: 0,
          color: "silver",
          dataLabels: {
            color: "black",
          },
        },
        {
          level: 1,
          color: "silver",
          dataLabels: {
            color: "black",
            style: {
              fontSize: 0.2,
            },
          },
        },
        {
          level: 2,
          dataLabels: {
            color: "black",
          },
        },
        {
          level: 3,
          dataLabels: {
            color: "black",
          },
        },
        {
          level: 4,
          dataLabels: {
            color: "black",
          },
        },
      ],
      nodes: [
        {
          id: "PCR",
          title: null,
          name: "D. Javier Gozález Perez",
          color: "#419dc0",
          info: "Presidente de la Comunidad de Regantes",
        },
        {
          id: "PJR",
          title: null,
          name: "D. Aurelio Cubero Ruedas",
          color: "#419dc0",
          info: "Presidente Jurado de riesgos",
        },
        {
          className: "title",
          id: "VJR",
          title: null,
          name: "D. Carlos Merino Bravo",
          layout: "hanging",
          color: "#41c0a4",
          info: "Vocal del Jurado de Riesgos",
        },
        {
          id: "ST",
          title: null,
          name: "D. Iago García Suarez",
          image: null,
          layout: "hanging",
          color: "#41c0a4",
          info: "Secretario y Tesorero",
        },
        {
          id: "VJRR1",
          title: null,
          name: "D. Guillermo Soriano García",
          layout: "hanging",
          color: "#41c0a4",
          info: "Vocal del Jurado de Riesgos 1",
        },
        {
          id: "VJRR2",
          title: null,
          name: "D. Álvaro Racionero",
          layout: "hanging",
          color: "#41c0a4",
          info: "Vocal del Jurado de Riesgos 2",
        },
        {
          id: "V",
          title: null,
          name: "VOCALES",
          column: 3,
          layout: "hanging",
          color: "#334eff",
          info: "Vocales",
        },
        {
          id: "V1",
          title: null,
          name: "Dña. Lidia Ruiz Ripoll",
          layout: "hanging",
          color: "#3abeef",
          info: "Vocal 1",
        },
        {
          id: "V2",
          title: null,
          name: "D. Javier Campos Zaldiernas",
          layout: "hanging",
          color: "#3abeef",
          info: "Vocal 2",
        },
        {
          id: "V3",
          name: "D. Juan Alfonso Figuerez Escribano",
          layout: "hanging",
          color: "#3abeef",
          info: "Vocal 3",
        },
        {
          id: "V4",
          name: "Dña. Elena Cejas Alcalde",
          layout: "hanging",
          color: "#3abeef",
          info: "Vocal 4",
        },
      ],
      colorByPoint: false,
      color: "#007ad0",
      dataLabels: {
        color: "white",
      },
      borderColor: "black",
      nodeWidth: "35vh",
      nodePadding: 2,
    },
  ],

  tooltip: {
    outside: true,
    formatter: function () {
      return this.point.info;
    },
  },
});
