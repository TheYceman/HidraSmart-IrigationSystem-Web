const optionIcons = document.querySelectorAll(".option-menu-icon");
const optionMenuSelectors = document.querySelectorAll(".option-menu-selector");
const menus = document.querySelectorAll(".menu-options");
const optionsScroll = document.getElementById("option-scroll");

function disableAllIcons() {
  for (let icon of optionIcons) {
    icon.classList.remove("active");
    icon.classList.add("inactive");
    icon.classList.remove("left");
    icon.classList.add("right");
  }
}

function selectMenu(menu) {
  disableAllIcons();
  if (+menu.dataset.navgroup === 0) {
    optionsScroll.classList.remove("menu1");
    optionsScroll.classList.remove("menu2");
    optionsScroll.classList.add("menu0");
  } else {
    for (let m of document.querySelectorAll(".option-menu-icon")) {
      if (+m.dataset.navgroup <= +menu.dataset.navgroup) {
        m.classList.remove("right");
        m.classList.add("left");
      }
    }
    if (+menu.dataset.navgroup === 1) {
      optionsScroll.classList.remove("menu0");
      optionsScroll.classList.remove("menu2");
      optionsScroll.classList.add("menu1");
    } else if (+menu.dataset.navgroup === 2) {
      optionsScroll.classList.remove("menu0");
      optionsScroll.classList.remove("menu1");
      optionsScroll.classList.add("menu2");
    }
  }
  menu.classList.remove("inactive");
  menu.classList.add("active");
}

window.onpagehide = (event) => {
  if (event.persisted) {
    //alert(document.cookie);
    
    //window.location.href = "http://localhost:3002/logout";
  }
};





