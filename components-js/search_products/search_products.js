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
            margin: 0 auto;
            width: 100%;
            border-radius: 15px;
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
            width: 60vw;
            position: relative;
        }

         @media (max-width: 600px) {

             .label_input {
            width: 100vw;
        }

          
        }

        /* IMÁGENES */
        img {
            width: clamp(50px, 50vw, 80px);
            object-fit: cover;
            border: 2px solid #5c2c59;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
        }
        .label_input input,
        .results {
            box-sizing: border-box;
        }

        /* CONTENEDOR RESULTADOS */
        .results {
            border: 2px solid #5c2c59;
            color: #5c2c59;
            width: 100%;
            max-height: 0;
            opacity: 0;
            overflow-y: auto;
            box-sizing: border-box;
            background-color: #fcdfd4;
            padding: 0 15px;
            transform: translateY(-10px);
            transition:
                max-height 0.35s ease,
                opacity 0.25s ease,
                transform 0.35s ease;

            scrollbar-width: none;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
        }

        .results::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        /* MOSTRAR RESULTADOS */
        .label_input:focus-within .results {
            max-height: 50vh;
            opacity: 1;
            transform: translateY(0);
            padding: 10px 15px;
        }

        /* CARD */
        .result {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            background-color: #fce0d5;
            border-bottom: 2px solid #5c2c59;
            border-radius: 15px 0 0 15px;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
            cursor: pointer;

            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.3s ease forwards;

            transition: 
                transform 0.25s ease,
                box-shadow 0.25s ease;
        }

        .result:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        }


        /* ANIMACIÓN CARDS */
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
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
