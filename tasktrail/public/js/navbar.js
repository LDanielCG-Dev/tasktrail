const burger = document.querySelector(".navbar-burger");
const menu = document.querySelector(".navbar-menu");

/**
 * Happy Meal
 */
burger.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menu.classList.toggle("es-position-fixed");
    menu.classList.toggle("es-fullwidth");
});
