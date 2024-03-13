$("#slides-news").slick({
  dots: true,
  prevArrow: `
      <div id="prev-arrow">
        <svg class="icon__cnt"><use xlink:href="#ei-arrow-left-icon"></use></svg>
      </div>`,
  nextArrow: `
      <div id="next-arrow">
        <svg class="icon__cnt"><use xlink:href="#ei-arrow-right-icon"></use></svg>
      </div>`,
  customPaging: function (slick, index) {
    var targetImage = slick.$slides.eq(index).find("img").attr("src");
    var targetDate = slick.$slides.eq(index).find("#fecha-noticia").text();
    var targetTitle = slick.$slides.eq(index).find("#titulo-noticia").text();
    return `
      <article class="miniatura_noticia">
          <img class="imagen_miniatura_noticia" src="${targetImage}"/>
          <p class="fecha_noticia_miniatura">
            ${targetDate}
          </p>
        <h2 class="titulo_noticia_miniatura">
          ${targetTitle}
        </h2>
      </article>`;
  },
});
