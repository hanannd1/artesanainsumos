class NavSlide extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();

        // Botón hamburguesa de la barra superior
        this.shadowRoot
            .querySelector(".boton")
            .addEventListener("click", () => this.toggleNav());

        // Botón hamburguesa dentro del menú lateral
        this.shadowRoot
            .querySelector(".botonNav")
            .addEventListener("click", () => this.toggleNav());
    }

    toggleNav() {
        const nav = this.shadowRoot.querySelector(".navSlide");
        nav.classList.toggle("open");
        this.isOpen = !this.isOpen;
    }

    getBasePath() {
    const path = window.location.pathname;

    if (path.includes('/components/')) {
        return '../../';
    }

    return './';
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

                .imagen {
                    width: 36px;
                }

                .cajatitulo {
                    text-decoration: none;
                }

                .logotipo {
                    color: #9E5170;
                    margin:0;
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
            </style>

            <!-- ====== BARRA SUPERIOR ====== -->
            <div class="barra-espaciadora"></div>
            <nav class="navSlide" id="navSlide">
        <div class="botonNav" onclick="openAndCloseNav()">
            <img src="${BASE}assets/simbolo-de-lista-de-tres-elementos-con-puntos.png" alt="">
        </div>
        <div class="categoriasMenu">
            <a href="${BASE}components/hilos/hilos.html">Hilos</a>
            <a href="${BASE}components/agujas/agujas.html">Agujas</a>
            <a href="${BASE}components/accesorios/accesorios.html">Accesorios</a>
           <a href="${BASE}components/llaveros/llaveros.html">Llaveros</a>

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
            <button class="boton" onclick="openAndCloseNav()">
                <img class="imagen" src="${BASE}assets/carrito-de-compras.png">
            </button>
        </div>
    </div>
        `;
    }
}

customElements.define("nav-slide", NavSlide);
