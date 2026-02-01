class ProductSearch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
    }

    connectedCallback() {
        this.render();
        this.loadData();
        this.addEvents();
    }

    getBasePath() {
        const path = window.location.pathname;

        if (path.includes('/components/')) {
            return '../../';
        }

        return './';
    }

    resolveImgPath(img) {
        const BASE = this.getBasePath();

        const cleanPath = img.replace(/^(\.\/|\.\.\/)+/, '');

        return BASE + cleanPath;
    }

    async loadData() {
        const BASE = this.getBasePath();

        const files = [
            `${BASE}productos/accesorios.json`,
            `${BASE}productos/agujas.json`,
            `${BASE}productos/hilos.json`
        ];

        const responses = await Promise.all(files.map(f => fetch(f)));
        const data = await Promise.all(responses.map(r => r.json()));

        this.items = data.flat();
    }

    search(term) {
        term = term.toLowerCase().trim();
        if (!term) return [];

        return this.items.filter(item =>
            item.titulo.toLowerCase().includes(term) ||
            item.descripcion.toLowerCase().includes(term) ||
            item.categoria.toLowerCase().includes(term)
        );
    }

    goToCatalog(categoria) {
        const BASE = this.getBasePath();
        const cat = categoria.toLowerCase().trim();

        const url = `${BASE}components/${cat}/${cat}.html`;
        window.location.href = url;
    }


    renderResults(results) {
        const container = this.shadowRoot.querySelector('.results');
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `<p>No hay resultados</p>`;
            return;
        }

        results.forEach(item => {
            const div = document.createElement('div');

            div.className = 'result';
            div.innerHTML = `
            <img loading="lazy" src="${this.resolveImgPath(item.img)}" alt="${item.titulo}">
            <div class="details">
            <strong>${item.titulo}</strong>
            <p>${item.categoria}</p>
            </div>
        `;

            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.goToCatalog(item.categoria);
            });

            container.appendChild(div);
        });
    }

    addEvents() {
        const input = this.shadowRoot.querySelector('input');

        input.addEventListener('input', e => {
            const results = this.search(e.target.value);
            this.renderResults(results);
        });
    }


    render() {
        this.shadowRoot.innerHTML = `
        <style>
            .label_input input {
                border: 2px solid #5c2c59;
                padding: 15px;
                width: 100%;
                border-radius: 15px;
                font-size: 1rem;
                box-sizing: border-box;
                margin:0 auto;
            }

            .label_input input:focus {
                outline: none;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            section {
                margin: 0 0 60px 0;
                display: flex;
                justify-content: center;
            }

            .label_input {
                width: 80vw;
                position: relative;
            }

            img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border: 2px solid #5c2c59;
                border-radius: 15px 0 0 15px;
            }

            .results {
                border: 2px solid #5c2c59;
                color: #5c2c59;
                width: 100%;
                max-height: 0;
                opacity: 0;
                overflow-y: auto;
                background-color: #fcdfd4;
                padding: 0 15px;
                transform: translateY(-10px);
                transition:
                    max-height 0.35s ease,
                    opacity 0.25s ease,
                    transform 0.35s ease;
                scrollbar-width: none;
                border-radius: 0 0 15px 15px;
                box-sizing: border-box;
            }

            .results::-webkit-scrollbar {
                display: none;
            }

            .label_input:focus-within .results {
                max-height: 50vh;
                opacity: 1;
                transform: translateY(0);
                padding: 10px 15px;
            }

            .result {
                display: flex;
                align-items: center;
                gap: 15px;
                margin: 15px 0;
                background-color: #fce0d5;
                border-bottom: 2px solid #5c2c59;
                border-radius: 15px 0 0 15px;
                filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
                cursor: pointer;
                opacity: 0;
                transform: translateY(10px);
                animation: fadeInUp 0.3s ease forwards;
                transition: transform 0.25s ease, box-shadow 0.25s ease;
            }

            .result:hover {
                transform: translateY(-6px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
            }

            .details strong {
                font-size: 1rem;
                display: block;
            }

            .details p {
                margin: 5px 0 0;
                font-size: 0.9rem;
            }

            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 600px) {

                section {
                    margin-bottom: 40px;
                }


                .label_input input {
                    padding: 12px;
                    font-size: 0.9rem;
                    border-radius: 12px;
                }

                img {
                    width: 55px;
                    height: 55px;
                }

                .result {
                    gap: 10px;
                    margin: 10px 0;
                }

                .details strong {
                    font-size: 0.9rem;
                }

                .details p {
                    font-size: 0.75rem;
                }

                .label_input:focus-within .results {
                    max-height: 60vh;
                }
            }


            
        </style>
        <section>
            <div class="label_input">
                <input  type="text" placeholder="Buscar productos..." id="buscador" />
                <div class="results"></div>
            </div>
        </section>
    `;
    }

}

customElements.define('product-search', ProductSearch);
