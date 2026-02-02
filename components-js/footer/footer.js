class FooterCostume extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
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
                .piedepagina {
                    background-color: #9E5170;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .contenidofooter {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 20px;
                }

                .logotipo {
                    color: #fce0d5;
                }

                .footertitle {
                    color: #fce0d5;
                    margin: 0;
                }

                .icono-enlace {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                }

                .linea {
                    height: 100px;
                    width: 5px;
                    border-radius: 100px;
                    background-color: #fce0d5;
                    margin: 0 30px;
                }

                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
            </style>

            <footer class="piedepagina">
                <div class="contenidofooter">
                    <h2 class="logotipo footertitle">ARTESANA INSUMOS</h2>
                    <div class="linea"></div>

                    <ul>
                        <li>
                            <a href="https://wa.link/76fgft" target="_blank"> 
                                <img class="icono-enlace" src="${BASE}assets/icono-whatsapp.png">
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/artesana.mcbo?igsh=NDFnMzkzM21vdTk0" target="_blank">                
                                <img class="icono-enlace" src="${BASE}assets/icono-instagram.png">
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        `;
    }
}
customElements.define("footer-costume", FooterCostume);
