window.sr = ScrollReveal();

var isOpen = false;
function navOpenAndClose() {
    let colors = document.getElementById('coloresFlores')
    if (isOpen == false) {
        let scrollHeight = colors.scrollHeight; // Obtenemos la altura completa del contenido
        colors.style.height = scrollHeight + 'px';
        isOpen = true
    } else {
        colors.style.height = '0'
        isOpen = false
    }
}


var isOpenNav = false
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

function apearAndDesapper(showid, hideid1, hideid2, hideid3) {
    let show = document.getElementById(`${showid}`);
    let hide1 = document.getElementById(`${hideid1}`);
    let hide2 = document.getElementById(`${hideid2}`);
    let hide3 = document.getElementById(`${hideid3}`);

    animateContainer(showid)

    show.style.display = "grid";

    hide1.style.display = "none";
    hide2.style.display = "none";
    hide3.style.display = "none"
}


function animateContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.opacity = 0;
    container.style.transform = "translateX(-100px)";
    container.style.transition = "opacity 1s ease, transform 1s ease";

    setTimeout(() => {
        container.style.opacity = 1;
        container.style.transform = "translateX(0)";
    }, 50);
}


sr.reveal(".cuerpoVista", {
    duration: 2000,
    origin: "left",
    distance: "150px",
    reset: false
})

function apearAndDesapper(...categorias) {
    const [mostrarId, ...ocultarIds] = categorias;

    const mostrar = document.getElementById(mostrarId);
    if (mostrar) {
        animateContainer(mostrarId);
        mostrar.style.display = "grid";
    }

    ocultarIds.forEach(id => {
        const ocultar = document.getElementById(id);
        if (ocultar) {
            ocultar.style.display = "none";
        }
    });
}

fetch('./../../productos/accesorios.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(productos => {
        const categorias = [];
        const contenedorCategorias = document.getElementById("botones");

        productos.forEach(producto => {
            if (!categorias.includes(producto.categoria)) {
                categorias.push(producto.categoria);
            }

            const contenedor = document.getElementById(producto.categoria);

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            const descripcionHTML = producto.descripcion
                ? `<h2>${producto.descripcion}</h2>`
                : '';

            const priceHTML = producto.descripcion
                ? `<h3>${producto.precio}</h3>`
                : '';

            tarjeta.innerHTML = `
                <img src="${producto.img}" alt="${producto.titulo}">
                <h3>${producto.titulo}</h3>
                ${descripcionHTML}
                ${priceHTML}
                <button class="btn_add_cart">Agregar al carrito</button>
            `;

            tarjeta.addEventListener("click", () => {
                open_modal(producto);
            });

            tarjeta.querySelector(".btn_add_cart").addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(producto, e.currentTarget);
            });


            contenedor.appendChild(tarjeta);
        });

        categorias.forEach((cat, index) => {
            const contenedor = document.getElementById(cat);
            contenedor.style.display = index === 0 ? "grid" : "none";
        });

        categorias.forEach((categoriaSeleccionada) => {
            const otrasCategorias = categorias.filter(c => c !== categoriaSeleccionada);
            const argumentos = [categoriaSeleccionada, ...otrasCategorias]
                .map(cat => `'${cat}'`)
                .join(", ");

            const boton = document.createElement("button");
            boton.textContent =
                categoriaSeleccionada.charAt(0).toUpperCase() +
                categoriaSeleccionada.slice(1);

            boton.setAttribute("onclick", `apearAndDesapper(${argumentos})`);
            contenedorCategorias.appendChild(boton);
        });
    })
    .catch(error => {
        console.error('Hubo un problema con la carga del JSON:', error);
    });



function close_modal() {
    const modalBox = document.getElementById("modalBox");
    modalBox.style.display = "none";
}

const addCartSound = new Audio("./../../assets/sounds/pop_add_cart.mp3");
addCartSound.volume = 0.4;

function addToCart(producto, btn = null) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(p => p.titulo === producto.titulo);

    if (index !== -1) {
        cart[index].cantidad += producto.cantidad || 1;
    } else {
        cart.push({
            titulo: producto.titulo,
            img: producto.img,
            descripcion: producto.descripcion,
            precio: producto.precio || 0,
            cantidad: producto.cantidad || 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new CustomEvent("cart-updated"));

    addCartSound.currentTime = 0;
    addCartSound.play();

    if (btn) {
        btn.classList.add("added");
        btn.textContent = "✔ Agregado";

        setTimeout(() => {
            btn.classList.remove("added");
            btn.textContent = "Agregar al carrito";
        }, 800);
    }

    const cartIcon = document.querySelector(".cart_icon");
    if (cartIcon) {
        cartIcon.classList.add("shake");
        setTimeout(() => cartIcon.classList.remove("shake"), 400);
    }
}

let productoActual = null;
let cantidadModal = 1;

function open_modal(producto) {
    productoActual = producto;
    cantidadModal = 1;

    const modalBox = document.getElementById("modalBox");
    const modalImg = modalBox.querySelector(".img_div img");
    const modalTitulo = modalBox.querySelector(".caracteristicas_div h2");
    const modalPrecio = modalBox.querySelector(".precio_modal");
    const modalDescripcion = modalBox.querySelector(".caracteristicas_div h3");
    const cantidadText = modalBox.querySelector(".product_amount_car p");

    modalImg.src = producto.img;
    modalImg.alt = producto.titulo;
    modalTitulo.textContent = producto.titulo;
    modalPrecio.textContent = producto.precio;
    modalDescripcion.textContent = producto.descripcion || "Sin descripción";

    cantidadText.textContent = cantidadModal;

    modalBox.style.display = "flex";
}

document.getElementById("modalBox").addEventListener("click", (e) => {

    const actionBtn = e.target.closest("button[data-action]");
    if (actionBtn) {
        const action = actionBtn.dataset.action;

        if (action === "plus") cantidadModal++;
        if (action === "minus" && cantidadModal > 1) cantidadModal--;

        document.querySelector("#modalBox .product_amount_car p").textContent = cantidadModal;
        return;
    }

    const addBtn = e.target.closest(".btn_add_cart");
    if (addBtn) {
        if (!productoActual) return;

        addToCart(
            {
                ...productoActual,
                cantidad: cantidadModal
            },
            addBtn
        );

        close_modal();
    }

});
