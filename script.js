document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS INICIALES ---
    const initialPeopleData = [
        { id: 1, nombre: 'Ana García', especie: ['Ovina', 'Caprina'], tecnología: ['Identificación y monitorización'], lineas: ['Comportamineto animal'], rol: 'IP', institucion: 'UPV' },
        { id: 2, nombre: 'Bruno Soler', especie: ['Ovina'], tecnología: ['Identificación y monitorización', 'Automatización y robots'], lineas: ['Optimización de recursos'], rol: 'Postdoc', institucion: 'UPV' },
        { id: 3, nombre: 'Carla Pons', especie: ['Caprina'], tecnología: ['Identificación y monitorización', 'Analisis de imágenes'], lineas: ['Comportamineto animal'], rol: 'Predoc', institucion: 'UPV' },
        { id: 4, nombre: 'David Roca', especie: ['Porcina'], tecnología: ['Ciencia de datos', 'Automatización y robots'], lineas: ['Optimización de recursos'], rol: 'IP', institucion: 'UdL/Agrotecnio' },
        { id: 5, nombre: 'Elena Ferré', especie: ['Porcina', 'Avícola'], tecnología: ['Automatización y robots', 'Detección y medición'], lineas: ['Optimización de recursos'], rol: 'Técnico', institucion: 'UdL/Agrotecnio' },
        { id: 6, nombre: 'Felipe Sanz', especie: ['Vacuna'], tecnología: ['Identificación y monitorización', 'Psicionamiento y navegación'], lineas: ['Comportamineto animal'], rol: 'IP', institucion: 'UCO' },
        { id: 7, nombre: 'Gloria Mínguez', especie: ['Vacuna'], tecnología: ['Identificación y monitorización', 'Detección y medición'], lineas: ['Salud animal'], rol: 'Postdoc', institucion: 'UCO' },
        { id: 8, nombre: 'Hector Blanes', especie: ['Ovina'], tecnología: ['Analisis de imágenes', 'Ciencia de datos'], lineas: ['Comportamineto animal'], rol: 'Predoc', institucion: 'USAL' },
        { id: 9, nombre: 'Irene Jiménez', especie: ['Ovina', 'Cunícula'], tecnología: ['Biosensores', 'Identificación y monitorización'], lineas: ['Optimización de recursos'], rol: 'IP', institucion: 'USAL' },
        { id: 10, nombre: 'Javier Luna', especie: ['Avícola'], tecnología: ['Detección y medición', 'Automatización y robots'], lineas: ['Optimización de recursos'], rol: 'Técnico', institucion: 'UAB' },
        { id: 11, nombre: 'Laura Vidal', especie: ['Avícola', 'Porcina'], tecnología: ['Automatización y robots', 'Ciencia de datos'], lineas: ['Optimización de recursos'], rol: 'IP', institucion: 'UAB' },
        { id: 12, nombre: 'Marco Rubio', especie: ['Caprina'], tecnología: ['Detección y medición', 'Psicionamiento y navegación'], lineas: ['Salud animal'], rol: 'Postdoc', institucion: 'UPV' },
        { id: 13, nombre: 'Nora Casado', especie: ['Porcina'], tecnología: ['Ciencia de datos', 'Analisis de imágenes'], lineas: ['Comportamineto animal'], rol: 'Predoc', institucion: 'UdL/Agrotecnio' },
        { id: 14, nombre: 'Oscar Pardo', especie: ['Vacuna'], tecnología: ['Identificación y monitorización', 'Detección y medición'], lineas: ['Optimización de recursos'], rol: 'Técnico', institucion: 'UCO' },
        { id: 15, nombre: 'Paula Navarro', especie: ['Caprina', 'Vacuna'], tecnología: ['Identificación y monitorización', 'Analisis de imágenes'], lineas: ['Comportamineto animal'], rol: 'IP', institucion: 'CICYTEX' }
    ];

    const filterConfig = {
        'Especie': ['Ovina', 'Caprina', 'Vacuna', 'Porcina', 'Avícola', 'Cunícula'],
        'Tecnología': ['Identificación y monitorización', 'Detección y medición', 'Biosensores', 'Psicionamiento y navegación', 'Automatización y robots', 'Analisis de imágenes', 'Ciencia de datos'],
        'Lineas': ['Salud animal', 'Optimización de recursos', 'Comportamineto animal', 'Monitoreo de emisiones', 'Reproducción y mejora genética'],
        'Rol': ['IP', 'Postdoc', 'Predoc', 'Técnico', 'Asesor científico'],
        'Institución': ['CICYTEX', 'CSIC/INIA', 'IRTA', 'IUCA', 'NEIKER', 'UAB', 'UCO', 'UdL/Agrotecnio', 'UM', 'USAL', 'USC/Campus Terra', 'UPV']
    };

    let peopleData = [];

    // --- GESTIÓN DE DATOS (localStorage) ---
    function saveData() {
        localStorage.setItem('peopleNetworkData', JSON.stringify(peopleData));
    }

    function loadData() {
        const savedData = localStorage.getItem('peopleNetworkData');
        if (savedData) {
            peopleData = JSON.parse(savedData);
        } else {
            peopleData = initialPeopleData;
            saveData();
        }
    }

    // --- RENDERIZADO DE LA UI ---
    const filtersContainer = document.getElementById('filters-container');
    

    function renderFiltersAndForm() {
        filtersContainer.innerHTML = '';
        

        for (const category in filterConfig) {
            const options = filterConfig[category];
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza el nombre de la categoría

            // Crear filtros en panel izquierdo
            const filterGroup = document.createElement('details');
            filterGroup.className = 'filter-group';
            filterGroup.setAttribute('data-category', category);
            filterGroup.innerHTML = `<summary>${category}</summary><div class="filter-options"></div>`;
            const optionsContainer = filterGroup.querySelector('.filter-options');
            options.forEach(option => {
                optionsContainer.innerHTML += `
                    <label>
                        <input type="checkbox" class="filter-checkbox" data-category="${key}" value="${option}">
                        ${option}
                    </label>
                `;
            });
            filtersContainer.appendChild(filterGroup);

           
        }
    }


    // --- LÓGICA DE VISUALIZACIÓN DE RED ---
    const networkContainer = document.getElementById('network');
    let network = null;

    function initializeNetwork() {
        const options = {
            nodes: {
                shape: 'dot',
                font: {
                    size: 14,
                    color: '#333'
                },
                borderWidth: 2
            },
            edges: {
                width: 1,
                color: {
                    color: '#848484',
                    highlight: '#0056b3',
                    hover: '#0056b3'
                },
                arrows: {
                    to: { enabled: false }
                },
                smooth: {
                    enabled: true,
                    type: "dynamic"
                }
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springConstant: 0.08,
                    springLength: 100,
                    damping: 0.4,
                    avoidOverlap: 0.5
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200
            }
        };
        network = new vis.Network(networkContainer, { nodes: [], edges: [] }, options);

        network.on("click", (params) => {
            if (params.nodes.length > 0) {
                const personId = params.nodes[0];
                showPersonInfo(personId);
                
            } else {
                hidePersonInfo();
            }
        });
    }

    function updateVisualization() {
        const selectedFilters = getSelectedFilters();
        const filteredPeople = filterPeople(selectedFilters);

        const { nodes, edges } = createNetworkData(filteredPeople);

        network.setData({ nodes, edges });
    }

    function getSelectedFilters() {
        const selected = {};
        document.querySelectorAll('.filter-checkbox:checked').forEach(checkbox => {
            const category = checkbox.dataset.category;
            if (!selected[category]) {
                selected[category] = [];
            }
            selected[category].push(checkbox.value);
        });
        return selected;
    }
    
    function filterPeople(filters) {
        if (Object.keys(filters).length === 0) {
            return peopleData; // Mostrar todos si no hay filtros
        }

        return peopleData.filter(person => {
            return Object.entries(filters).some(([category, values]) => {
                 const personValue = person[category];
                 if (!personValue) return false;

                 if (Array.isArray(personValue)) {
                     return personValue.some(item => values.includes(item));
                 } else {
                     return values.includes(personValue);
                 }
            });
        });
    }

    function createNetworkData(filteredPeople) {
        const nodes = [];
        const edges = new Set();
        
        const peopleMap = new Map(filteredPeople.map(p => [p.id, p]));
        
        // Lógica de jerarquía IP/Satélite
        const institutionGroups = {};
        filteredPeople.forEach(p => {
            if (!institutionGroups[p.institucion]) {
                institutionGroups[p.institucion] = { ip: [], others: [] };
            }
            if (p.rol === 'IP') {
                institutionGroups[p.institucion].ip.push(p);
            } else {
                institutionGroups[p.institucion].others.push(p);
            }
        });

        filteredPeople.forEach(person => {
            let isSatellite = false;
            const group = institutionGroups[person.institucion];
            if (group && group.ip.length > 0 && person.rol !== 'IP') {
                isSatellite = true;
            }

            nodes.push({
                id: person.id,
                label: person.nombre,
                title: `${person.nombre} (${person.rol} en ${person.institucion})`,
                value: person.rol === 'IP' ? 30 : 15, // Tamaño del nodo
                mass: person.rol === 'IP' ? 5 : 1, // 'Peso' para la física
                color: isSatellite ? '#f4a261' : (person.rol === 'IP' ? '#e76f51' : '#2a9d8f')
            });
        });

        // Crear conexiones (edges)
        for (let i = 0; i < filteredPeople.length; i++) {
            for (let j = i + 1; j < filteredPeople.length; j++) {
                const personA = filteredPeople[i];
                const personB = filteredPeople[j];
                const commonality = findCommonality(personA, personB);
                if (commonality.length > 0) {
                    const edgeId = [personA.id, personB.id].sort().join('-');
                    edges.add({
                        id: edgeId,
                        from: personA.id,
                        to: personB.id,
                        title: `En común: ${commonality.join(', ')}`
                    });
                }
            }
        }
        
        return { nodes, edges: Array.from(edges) };
    }

    function findCommonality(p1, p2) {
        const common = [];
        if (p1.institucion === p2.institucion) common.push(p1.institucion);
        
        // Specific check for 'rol' to avoid it being treated as a multi-select if it's not
        if (p1.rol === p2.rol) common.push(p1.rol);

        // Iterate through filterConfig, excluding 'Rol' and 'Institución' as they are handled above
        Object.keys(filterConfig).forEach(cat => {
            const key = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            // Only process if the key is not 'rol' or 'institucion'
            if (key !== 'rol' && key !== 'institucion') {
                const val1 = p1[key] || [];
                const val2 = p2[key] || [];
                if (Array.isArray(val1) && Array.isArray(val2)) {
                    const shared = val1.filter(v => val2.includes(v));
                    if (shared.length > 0) common.push(...shared);
                }
            }
        });

        return [...new Set(common)]; // Devolver únicos
    }

    // --- LÓGICA DE LA TARJETA DE INFORMACIÓN ---
    const infoCard = document.getElementById('person-info-card');
    const infoName = document.getElementById('info-name');
    const infoDetails = document.getElementById('info-details');
    
    function showPersonInfo(personId) {
        const person = peopleData.find(p => p.id === personId);
        if (!person) return;

        infoName.textContent = person.nombre;
        let detailsHtml = `<p><strong>ID:</strong> ${person.id}</p>`;
        for (const category in filterConfig) {
             const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
             const value = person[key];
             if(value && (!Array.isArray(value) || value.length > 0)) {
                detailsHtml += `<p><strong>${category}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>`;
             }
        }
        infoDetails.innerHTML = detailsHtml;
        infoCard.style.display = 'block';
    }

    function hidePersonInfo() {
        infoCard.style.display = 'none';
    }


    // --- LÓGICA DEL FORMULARIO CRUD ---
    // Removed all CRUD related functions and event listeners

    // --- INICIALIZACIÓN Y EVENT LISTENERS ---
    loadData();
    renderFiltersAndForm();
    initializeNetwork();
    updateVisualization();

    document.getElementById('filters-container').addEventListener('change', updateVisualization);
    document.getElementById('close-card-btn').addEventListener('click', hidePersonInfo);
    
});