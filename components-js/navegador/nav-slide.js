class NavSlide extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.isOpen = false;
        this.isOpenCar = false;
    }

    connectedCallback() {
        this.render();

        this.shadowRoot
            .getElementById("openFinish")
            .addEventListener("click", () => this.open_Modal_finish());

        this.shadowRoot
            .getElementById("closeFinish")
            .addEventListener("click", () => this.close_Modal_finish());

        this.shadowRoot
            .getElementById("sendWhatsapp")
            .addEventListener("click", () => this.enviarPedidoWhatsapp());

            window.addEventListener("cart-updated", () => {
                this.renderCartInNav();
            });
        this.shadowRoot
            .getElementById("search_modal")
            .addEventListener("click", () => this.open_Modal_search())
        this.shadowRoot
            .getElementById("search_modal_close")
            .addEventListener("click", () => this.close_Modal_search())


        this.shadowRoot
            .querySelector(".boton")
            .addEventListener("click", () => this.toggleNav());

        this.shadowRoot
            .querySelector(".botonNav")
            .addEventListener("click", () => this.toggleNav());

        this.shadowRoot
            .querySelector("#boton_open_car")
            .addEventListener("click", () => this.toggleNavCar());

        this.shadowRoot
            .querySelector("#boton_close_car")
            .addEventListener("click", () => this.toggleNavCar());
        
        this.shadowRoot
            .querySelector("#boton_clear_car")
            .addEventListener("click", () => this.deleteCart())
        
    
        this.shadowRoot.addEventListener("click", (e) => {
            const deleteBtn = e.target.closest(".delete_img");
            const actionBtn = e.target.closest("button[data-action]");

            let cart = this.getCart();

            if (deleteBtn) {
                const titulo = deleteBtn.dataset.titulo;
                cart = cart.filter(item => item.titulo !== titulo);
                this.saveCart(cart);
                this.renderCartInNav();
                return;
            }

            if (actionBtn) {
                const titulo = actionBtn.dataset.titulo;
                const action = actionBtn.dataset.action;

                const index = cart.findIndex(item => item.titulo === titulo);
                if (index === -1) return;

                if (action === "plus") cart[index].cantidad++;
                if (action === "minus") {
                    cart[index].cantidad--;
                    if (cart[index].cantidad <= 0) cart.splice(index, 1);
                }

                this.saveCart(cart);
                this.renderCartInNav();
            }
        });



    }

    

    toggleNav() {
        const nav = this.shadowRoot.querySelector(".navSlide");
        nav.classList.toggle("open");
        this.isOpen = !this.isOpen;
    }


    toggleNavCar() {
        const nav = this.shadowRoot.querySelector("#CarSlide");
        const isOpening = !nav.classList.contains("open");

        nav.classList.toggle("open");

        if (isOpening) {
            this.renderCartInNav();
        }
    }


    getBasePath() {
        const path = window.location.pathname;

        if (path.includes('/components/')) {
            return '../../';
        }

        return './';
    }

    getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        this.renderCartInNav();
    }

    deleteCart(){
        localStorage.clear();
        this.renderCartInNav()
    }


    parsePrice(precio) {
        if (typeof precio === "number") return precio;

        if (typeof precio === "string") {
            return Number(
                precio
                    .replace("$", "")
                    .replace(",", ".")
                    .trim()
            ) || 0;
        }

        return 0;
    }

    resolveImgPath(img) {
        const BASE = this.getBasePath();

        const cleanPath = img.replace(/^(\.\/|\.\.\/)+/, '');

        return BASE + cleanPath;
    }



    renderCartInNav() {
        const nav = this.shadowRoot.querySelector("#CarSlide");
        const bodyCar = nav.querySelector(".body_car");
        const totalContainer = nav.querySelector(".total_car h3");

        if (!bodyCar || !totalContainer) return;

        const cart = this.getCart();
        bodyCar.innerHTML = "";

        let total = 0;

        cart.forEach(item => {
            const product = document.createElement("div");
            product.classList.add("product_car");
            const BASE = this.getBasePath();

            const precioNumerico = this.parsePrice(item.precio);
            total += precioNumerico * item.cantidad;

            product.innerHTML = `
            <div class="product_img_car">
                <img loading="lazy" src="${this.resolveImgPath(item.img)}" alt="${item.titulo}">

            </div>

            <div class="product_details">
                <div class="product_details_delete_car">
                    <p>${item.titulo} ${" : "+ item.descripcion || ''}</p>
                </div>

                <div class="product_price_quantity">
                    <div class="delete_img" data-titulo="${item.titulo}">
                        <img src="${BASE}assets/bote-de-basura.png">
                    </div>

                    <div class="product_amount_car">
                        <button data-action="minus" data-titulo="${item.titulo}">-</button>
                        <p>${item.cantidad}</p>
                        <button data-action="plus" data-titulo="${item.titulo}">+</button>
                    </div>

                    <div class="product_price_car">
                        <p>${(precioNumerico * item.cantidad).toLocaleString()}$</p>
                    </div>
                </div>
            </div>
        `;

            bodyCar.appendChild(product);
        });

        if (cart.length === 0) {
            bodyCar.innerHTML = `<p class="empty_cart">Tu carrito está vacío</p>`;
            totalContainer.textContent = "Total 0$";
            return;
        } else {
            totalContainer.textContent = `Total ${total.toLocaleString()}$`;
        }


    }

enviarPedidoWhatsapp() {
    const root = this.shadowRoot;

    const nombre = root.getElementById("nombreCliente").value.trim();
    const entregaSeleccionada = root.querySelector('input[name="entrega"]:checked');
    const comentarios = root.getElementById("comentarios").value.trim();

    if (!nombre || !entregaSeleccionada) {
        alert("Completa todos los campos");
        return;
    }

    const cart = this.getCart();
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let total = 0;
    let mensaje = `¡Hola! 👋✨
Vengo desde la página de Artesana Insumos.

Mi nombre es: ${nombre}
El tipo de entrega que deseo es: ${entregaSeleccionada.value}

Mi pedido es:
`;

    cart.forEach(item => {
        const precio = this.parsePrice(item.precio);
        const subtotal = precio * item.cantidad;
        total += subtotal;

        mensaje += `• ${item.titulo}:\n  x${item.cantidad} * ${precio}$ = ${subtotal}$\n`;
    });

    mensaje += `
El total de mi compra es: $${total}

Comentarios:
${comentarios || "Sin comentarios"}

Quedo pendiente para confirmar mi pedido y coordinar el pago.
¡Muchas gracias! 💛🧶`;

    const telefono = "584246719237";
    window.open(
        `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );
    this.close_Modal_finish();
    this.deleteCart();
}

open_Modal_finish() {
    this.shadowRoot
        .getElementById("modal_finish")
        .classList.add("open");
}

close_Modal_finish() {
    this.shadowRoot
        .getElementById("modal_finish")
        .classList.remove("open");
}
open_Modal_search() {
    this.shadowRoot
        .getElementById("modal_search")
        .classList.add("open");
}

close_Modal_search() {
    this.shadowRoot
        .getElementById("modal_search")
        .classList.remove("open");
}

    render() {
        const BASE = this.getBasePath();

        this.shadowRoot.innerHTML = `
            <style>
                /* ====== BARRA SUPERIOR ====== */

                .navegador {
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                    background-color: #fcdfd4;
                    padding: 10px;
;
                }

                .boton {
                    background-color: #fcdfd4;
                    cursor: pointer;
                    border: none;
                }
                
                .cajatitulo {
                    text-decoration: none;
                }
                .imagen {
                    width: clamp(15px, 50vw, 29px);
                    height: auto;
                }
                .logotipo {
                    color: #9E5170;
                    margin:0;
                    font-size: clamp(18px, 2vw, 23px);

                }

                .cajainvisible {
                    width: 36px;
                }

                /* ====== NAV SLIDE ====== */
                .navSlide {
                    display: flex;
                    box-sizing: border-box;
                    overflow: hidden;
                    background-color: #fcdfd4;
                    position: fixed;

                    top: 0;              /* ← AÑADE SOLO ESTO */
                    height: 100vh;

                    z-index: 1200;
                    padding: 10px 30px 10px 10px;
                    gap: 15px;
                    border-right: 5px #5c2c59 solid;
                    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.80));
                    flex-direction: column;

                    left: -300px;
                    width: 300px;
                    transition: transform 0.3s ease-in-out;
                }


                .navSlide.open {
                    transform: translateX(300px);
                }

                .botonNav img {
                    width: 36px;
                    cursor: pointer;
                }

                .categoriasMenu {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .categoriasMenu a {
                    text-decoration: none;
                    color: #5c2c59;
                    font-size: 22px;
                    font-weight: 800;
                }

                .iconWaAndIn {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .icono-enlace-nav {
                    width: 30px;
                    height: 30px;
                    object-fit: cover;
                }
                     /* ========== CarSlide ========*/
        .CarSlide {
            display: flex;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;

            scrollbar-width: none;
            background-color: #fcdfd4;
            position: fixed;
            top: 0;
            height: 100vh;
            height: 100dvh;
            z-index: 1200;
            padding: 10px;
            gap: 15px;
            border-left: 5px #5c2c59 solid;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.80));
            flex-direction: column;

            right: -500px;
            width: 500px;
            transition: transform 0.3s ease-in-out;
        }
            @supports (-webkit-touch-callout: none) {
            .CarSlide {
                height: -webkit-fill-available;
            }
        }


      

        .CarSlide.open {
            transform: translateX(-500px);
        }

        .close_modal_button {
            cursor: pointer;
            transition: all .3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            aspect-ratio: 1/1;
            color: #9E5170;
            border: solid 2px #9E5170;
            width: 30px;
        }

        .close_modal_button:hover {
            color: white;
            background-color: #9E5170;
            ;
            border-radius: 50%;
            aspect-ratio: 1/1;
            transition: all .3s ease;
        }

        .title_car {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            color: #5c2c59;
        }

        .title_car h2 {
            margin: 10px 0;
        }

        .body_car {
            border: 3px solid #5c2c59;
            padding: 10px 30px;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            height: 100vh;

            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;

            scrollbar-width: none;
        }

        .body_car::-webkit-scrollbar {
            width: 0px;
            height: 0px;
        }

        .product_car {
            display: flex;
            width: 100%;
            height: fit-content;
            gap: 30px;
            padding: 0 5px;
        }

        .product_img_car {
            width: 10%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .product_img_car img {
            width: clamp(30px, 50vw, 60px);
            object-fit: cover;
            border-radius: 15px;
            aspect-ratio: 1/1;
            border: 2px #5c2c59 solid;
            border-radius: 12px;
        }

        .product_details {
            width: 90%;
        }

        .product_price_quantity {
            display: grid;
            grid-template-columns: auto auto 1fr;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        .product_amount_car {
            display: flex;
            align-items: center;
            height: fit-content;
        }

        .product_amount_car button {
            background-color: #5c2c59;
            color: white;
            width: 25px;
            font-weight: bold;
            height: 25px;
            border: transparent 2px solid;
            transition: all .3s ease;
            cursor: pointer;

        }

        .product_amount_car p {
            background-color: white;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }

        .product_amount_car button:nth-child(1) {
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;

        }

        .product_amount_car button:nth-child(3) {
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;

        }

        .product_amount_car button:hover {
            background-color: white;
            color: #5c2c59;
            width: 25px;
            border: #5c2c59 2px solid;
            transition: all .3s ease;
        }

        .product_price_car {
            border: 2px #5c2c59 solid;
            border-radius: 12px;
            height: 30px;
            padding: 0 5px;
            background-color: white;
        }

        .product_price_car p {
            margin: 5px 0;
            color: #5c2c59;
            font-weight: bold;
            text-align: center;
        }

        .product_details_delete_car {
            width: 100%;
            height: 60px;
            overflow: hidden;
            box-sizing: border-box;
        }

        .product_details_delete_car p {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 14px;
        }

        .delete_img img {
            cursor: pointer;
            width: clamp(15px, 50vw, 20px);
            transition: all .3s ease;
        }

        .delete_img img:hover {
            transform: scale(1.2);
            transition: all .3s ease;
        }

        .total_car {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-radius: 15px;
            border: 3px solid #5c2c59;

        }

        .total_car h3 {
            margin: 10px;
            color: #5c2c59;
        }

        .delete_finish_button {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .green_button {
            background-color: green;
            color: white;
            width: fit-content;
            height: fit-content;
            padding: 10px 15px;
            border-radius: 10px;
            border: transparent 2px solid;
            transition: all .2s ease;
            cursor: pointer;
        }

        .green_button:hover {
            background-color: white;
            color: green;
            border: green 2px solid;
            transition: all .2s ease;
        }

        .red_button {
            background-color: red;
            color: white;
            width: fit-content;
            height: fit-content;
            padding: 10px 15px;
            border-radius: 10px;
            border: transparent 2px solid;
            transition: all .2s ease;
            cursor: pointer;

        }

        .red_button:hover {
            background-color: white;
            color: red;
            border: red 2px solid;
            transition: all .2s ease;
        }
            .empty_cart{
                text-align:center;
            }

        .modalBox {
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 1600;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(92, 44, 89, 0.6);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .modalBox.open {
            opacity: 1;
            pointer-events: auto;
        }
        .modalBoxSearch{
             width: 100%;
            height: 100%;
            position: fixed;
            z-index: 1600;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(92, 44, 89, 0.6);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .modalBoxSearch.open {
            opacity: 1;
            pointer-events: auto;
        }


        .modal {
            width: fit-content;
            background-color: #9E5170;
            color: white;
            padding: 10px 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 20px;
            border: solid 3px white;
        }

        .container_button_close {
            display: flex;
            justify-content: end;
            width: 100%;
        }

        .close_modal_button_finish {
            cursor: pointer;
            transition: all .3s ease;
            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            aspect-ratio: 1/1;
            color: white;

            border: solid 2px white;
            width: 30px;

        }

        .close_modal_button_finish:hover {
            color: #9E5170;
            background-color: white;
            border-radius: 50%;
            aspect-ratio: 1/1;
            transition: all .3s ease;
        }

        .formPedido {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .label_input {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .label_input input, .label_input textarea{
            border: 2px solid #5c2c59;
            padding: 5px 15px;
            border-radius: 10px;

        }
         .label_input input:focus, .label_input textarea:focus  {
            outline: none;
        }
        .checkbox_unico input[type="radio"] {
            accent-color: #5c2c59;
            outline: none;
            width: 30px;
            margin: 8px 0;
        }   

       .button_finish_modal {
            background-color: green;
            color: white;
            width: fit-content;
            height: fit-content;
            margin: 0 auto;
            padding: 10px 15px;
            border-radius: 10px;
            border: transparent 2px solid;
            transition: all .2s ease;
            cursor: pointer;
        }

        .button_finish_modal:hover {
            background-color: white;
            color: green;
            border: green 2px solid;
            transition: all .2s ease;
        }
    

        @media (max-width: 600px) {
         .CarSlide {
                width: 100vw;
            }

            .boton {
                padding: 4px;
            }

            .navegador {
                padding: 8px;
            }
            .logotipo {
                display:none;

            }

        }

            </style>

            <!-- ====== BARRA SUPERIOR ====== -->
            <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=close" />
         <div class="modalBox" id="modal_finish">
            <div class="modal">
                <div class="container_button_close">
                    <div class="close_modal_button_finish" id="closeFinish">
                        <span class="material-symbols-outlined">close</span>
                    </div>
                </div>

                <h2>¡Ya casi acabamos!</h2>

                <form class="formPedido">
                    <div class="label_input">
                        <label>Nombres y Apellidos completos</label>
                        <input type="text" id="nombreCliente">
                    </div>

                    <label>Tipo de Entrega:</label>

                    <div class="checkbox_unico">
                        <input type="radio" name="entrega" value="Envío nacional">
                        <label>Envío nacional</label>
                    </div>

                    <div class="checkbox_unico">
                        <input type="radio" name="entrega" value="Delivery">
                        <label>Delivery</label>
                    </div>

                    <div class="checkbox_unico">
                        <input type="radio" name="entrega" value="Entrega presencial">
                        <label>Entrega presencial</label>
                    </div>

                    <div class="label_input">
                        <label>Comentarios adicionales</label>
                        <textarea id="comentarios"></textarea>
                    </div>

                    <button class="button_finish_modal" type="button" id="sendWhatsapp">
                        Finalizar pedido por WhatsApp
                    </button>
                </form>
            </div>
        </div>
        <div class="modalBoxSearch" id="modal_search">
            <div class="modal">
                <div class="container_button_close">
                    <div class="close_modal_button_finish" id="search_modal_close">
                        <span class="material-symbols-outlined">close</span>
                    </div>
                </div>

                <h2>¡Aquí puedes buscar tu producto!</h2>

                    <product-search></product-search>

            </div>
        </div>    
        <div class="barra-espaciadora"></div>
            <nav class="navSlide" id="navSlide">
        <div class="botonNav" onclick="openAndCloseNav()">
            <img src="${BASE}assets/simbolo-de-lista-de-tres-elementos-con-puntos.png" alt="">
        </div>
        <div class="categoriasMenu">
            <a href="${BASE}components/hilos/hilos.html">Hilos</a>
            <a href="${BASE}components/agujas/agujas.html">Agujas</a>
            <a href="${BASE}components/accesorios/accesorios.html">Accesorios</a>

            <div class="iconWaAndIn">
                <a href="https://wa.link/76fgft"> 
                    <img class="icono-enlace-nav" src="${BASE}assets/icono-whatsapp.png">
                </a>
                <a href="https://www.instagram.com/artesana.mcbo?igsh=NDFnMzkzM21vdTk0">                
                    <img class="icono-enlace-nav" src="${BASE}assets/icono-instagram.png">
                </a>
            </div>
        </div>
    </nav>
    <div class="navegador">
        <div class="menu">
            <button class="boton" onclick="openAndCloseNav()">
                <img class="imagen" src="${BASE}assets/simbolo-de-lista-de-tres-elementos-con-puntos.png">
            </button>
        </div>
        <a href="${BASE}index.html" class="cajatitulo">
            <h2 class="logotipo">ARTESANA INSUMOS</h2>
        </a>
        
        <div class="menu">
         <button class="boton" id="search_modal">
                <img class="imagen" src="${BASE}assets/search-icon.png">
            </button>
            <button class="boton" id="boton_open_car">
                <img class="imagen" src="${BASE}assets/carrito-de-compras.png">
            </button>
        </div>
    </div>
    <nav class="CarSlide" id="CarSlide">
        <div class="botonNav">
            <div class="close_modal_button" id="boton_close_car">
                <span class="material-symbols-outlined">
                    close
                </span>
            </div>
            <div class="title_car">
                <h2>Carrito de Compras</h2>
            </div>
        </div>

        <div class="body_car">
        </div>

        <div class="total_car">
            <h3>Total $250</h3>
        </div>
        <div class="delete_finish_button">
            <button class="red_button" id="boton_clear_car">Eliminar carrito</button>
            <button id="openFinish" class="green_button">Finalizar compra</button>
        </div>
    </nav>
        `;
    }
}

customElements.define("nav-slide", NavSlide);
