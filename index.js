window.sr = ScrollReveal();

let isOpenNav = false;

function openAndCloseNav() {
    let navSlide = document.getElementById("navSlide");
    if (!isOpenNav) {
        navSlide.classList.add("open"); 
        isOpenNav = true;
    } else {
        navSlide.classList.remove("open"); 
        isOpenNav = false;
    }
}



sr.reveal(".carrusel",{
    duration: 2000, 
    origin: "left",
    distance: "150px",
    reset: true
})
sr.reveal(".catalogo",{
    duration: 2000, 
    origin: "left",
    distance: "150px",
    reset: true
})
