let servicios = document.querySelectorAll(".slide");
let names = [];
let images = [];
let colors = [];

servicios.forEach(function (servicioSlide) {
  names.push(servicioSlide.dataset.name);
  images.push(servicioSlide.dataset.image);
  colors.push(servicioSlide.dataset.color);
});

class gsapSlider {
  constructor(names, images, slides, container, titles, colors) {
    this.names = names;
    this.images = images;
    this.slides = slides;
    this.titles = titles;
    this.colors = colors;
    this.imageContainer = $(".slider_images");
    this.container = container;
    this.imageSlides;
    this.pagination;
    this.cur = slides.length - 1;
    this.playing = false;

    this.setupImages();
    this.setupGsap();
    this.setPagination();
    this.setButtons();
    this.moveSlide(0);
  }

  setupImages() {
    let backgrounds = $("<div />", {
      class: "backgrounds",
    });

    this.images.forEach((image, i) => {
      let imageSlide = $("<div />", {
        class: "slide-image",
      });
      imageSlide.append(
        $("<img />", {
          src: image,
        })
      );

      this.imageContainer.append(imageSlide);

      backgrounds.append(this.setupBackground(image, i));
    });

    this.imageSlides = $(".slide-image");
    this.imageContainer.prepend(backgrounds);
  }

  setupBackground(image, i) {
    let bgslide = $("<div />", {
      class: "bg-pieces bg-" + i.toString(),
    });

    let bgpiece = $("<div />").css({
      backgroundImage: 'url("' + image + '")',
    });

    bgpiece.clone().addClass("bgpiece one").appendTo(bgslide);
    bgpiece.clone().addClass("bgpiece two").appendTo(bgslide);
    bgpiece.clone().addClass("bgpiece three").appendTo(bgslide);
    bgpiece.clone().addClass("bgpiece four").appendTo(bgslide);

    return bgslide;
  }

  setupGsap() {
    gsap.set(this.slides, { y: 600, opacity: 0 });
    gsap.set(this.titles, { x: 1600, opacity: 0 });
    gsap.set(".one", { left: "110vw" });
    gsap.set(".two", { left: "100vw" });
    gsap.set(".three", { left: "-100%" });
    gsap.set(".four", { left: "-200vw" });
    gsap.set(".slide-image", { y: -100 + "vw" });
  }

  setButtons() {
    $(".page-trigger").click((event) => {
      this.moveSlide($(event.target).data("page") - 1);
    });
  }

  moveSlide(next) {
    if (this.playing) {
      return;
    }

    let text = this.slides[this.cur];
    let title = this.titles[this.cur];
    let inner = this.imageSlides[this.cur];
    let bgPieces = $(".bg-pieces")[this.cur];

    let tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.in",
      },
    });

    tl.to(".four", { left: -1400, duration: 0.5 })
      .to(inner, { opacity: 0.5, duration: 0.6 }, 0.2)
      .to(inner, { y: -100 + "vw", duration: 0.2 }, 0.4)
      .to(".two", { left: -1600, duration: 0.5 }, 0.3)
      .to(".three", { left: 1600, duration: 0.5 }, 0.2)
      .to(".one", { left: 1600, duration: 0.5 }, 0.4)
      .to(text, { opacity: "0", duration: 0.4 }, 0.1)
      .to(text, { y: 100 + "vw", duration: 0.6 }, "<")
      .to(title, { opacity: "0", duration: 0.4 }, 0.1)
      .to(title, { x: 1600, duration: 0.6 }, "<");

    this.cur = next;

    $(".current").removeClass("current");
    this.pagination.find(".page-" + (this.cur + 1)).addClass("current");
    text = this.slides[this.cur];
    title = this.titles[this.cur];
    let color = this.colors[this.cur];
    inner = this.imageSlides[this.cur];
    bgPieces = $(".bg-pieces")[this.cur];

    tl.to(text, { y: 0 + "vw", opacity: "1", duration: 0.8 }, 0.5)
      .to(
        title,
        { x: -28.4 + "vw", opacity: "1", color: color, duration: 1.2 },
        0.5
      )
      .to(
        bgPieces.querySelector(".one"),
        { left: 0 + "vw", duration: 0.5, ease: "power1.out" },
        0.4
      )
      .to(
        bgPieces.querySelector(".three"),
        { left: "-50px", duration: 0.5 },
        "<.1"
      )
      .to(
        bgPieces.querySelector(".two"),
        { left: "20px", duration: 0.6 },
        "<.1"
      )
      .to(
        bgPieces.querySelector(".four"),
        { left: "40px", duration: 0.6, ease: "power1.out" },
        "<.2"
      )
      .fromTo(
        inner,
        { y: 100 + "vw", immediateRender: false },
        { y: 0 + "vw", duration: 0.4, ease: "power1.out" },
        "<.2"
      )
      .to(inner, { opacity: 1, duration: 0.4 }, "<")
      .to(
        inner.querySelector("img"),
        0.2,
        { scale: 1.08, ease: "power1.out" },
        "<"
      )
      .to(
        inner.querySelector("img"),
        0.5,
        { scale: 1, ease: "power1.out" },
        "<+.2"
      )
      .then(() => {
        this.playing = false;
      });

    tl.play();
    this.playing = true;
  }

  setPagination() {
    let pagination = $("<div />", {
      class: "pagination",
    });

    let len = this.slides.length;

    for (let i = 1; i <= len; i++) {
      pagination.append(
        $("<div/>", {
          class: "page-trigger page-" + i,
          "data-page": i,
          css: {
            backgroundImage: "url(" + images[i - 1] + ")",
            color: colors[i - 1],
          },
        }).append(this.names[i - 1])
      );
    }

    this.pagination = pagination;
    this.pagination.insertAfter(this.container);
  }
}

new gsapSlider(
  names,
  images,
  $(".slider_text_info"),
  $("#slider-servicios"),
  $(".slider_text_title"),
  colors
);
