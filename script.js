// script.js

const initialPeopleData = [
  {
    id: 1,
    nombre: "Ana",
    indicadores: {
      Especie: ["Ovina", "Vacuna"],
      Tecnología: ["Identificación y monitorización", "Ciencia de datos"],
      Líneas: ["Salud animal"],
      Rol: ["IP"],
      Institución: ["CSIC/INIA"]
    }
  },
  {
    id: 2,
    nombre: "Luis",
    indicadores: {
      Especie: ["Porcina"],
      Tecnología: ["Biosensores"],
      Líneas: ["Optimización de recursos"],
      Rol: ["Postdoc"],
      Institución: ["CSIC/INIA"]
    }
  },
  // ... Agrega hasta 15 personas con diferentes combinaciones de indicadores
  {
    id: 3,
    nombre: "María",
    indicadores: {
      Especie: ["Avícola"],
      Tecnología: ["Automatización y robots"],
      Líneas: ["Comportamineto animal"],
      Rol: ["Predoc"],
      Institución: ["IRTA"]
    }
  },
  {
    id: 4,
    nombre: "Pedro",
    indicadores: {
      Especie: ["Cunícula"],
      Tecnología: ["Psicionamiento y navegación"],
      Líneas: ["Reproducción y mejora genética"],
      Rol: ["IP"],
      Institución: ["UCO"]
    }
  },
  {
    id: 5,
    nombre: "Lucía",
    indicadores: {
      Especie: ["Caprina"],
      Tecnología: ["Detección y medición", "Biosensores"],
      Líneas: ["Monitoreo de emisiones"],
      Rol: ["Técnico"],
      Institución: ["UCO"]
    }
  },
  {
    id: 6,
    nombre: "Carlos",
    indicadores: {
      Especie: ["Ovina"],
      Tecnología: ["Identificación y monitorización"],
      Líneas: ["Salud animal"],
      Rol: ["Asesor científico"],
      Institución: ["NEIKER"]
    }
  },
  {
    id: 7,
    nombre: "Sofía",
    indicadores: {
      Especie: ["Porcina", "Caprina"],
      Tecnología: ["Ciencia de datos"],
      Líneas: ["Reproducción y mejora genética"],
      Rol: ["Postdoc"],
      Institución: ["IRTA"]
    }
  },
  {
    id: 8,
    nombre: "David",
    indicadores: {
      Especie: ["Vacuna"],
      Tecnología: ["Análisis de imágenes"],
      Líneas: ["Comportamineto animal"],
      Rol: ["IP"],
      Institución: ["USAL"]
    }
  },
  {
    id: 9,
    nombre: "Elena",
    indicadores: {
      Especie: ["Ovina", "Avícola"],
      Tecnología: ["Automatización y robots", "Psicionamiento y navegación"],
      Líneas: ["Optimización de recursos"],
      Rol: ["Predoc"],
      Institución: ["UPV"]
    }
  },
  {
    id: 10,
    nombre: "Jorge",
    indicadores: {
      Especie: ["Cunícula"],
      Tecnología: ["Biosensores"],
      Líneas: ["Monitoreo de emisiones"],
      Rol: ["Técnico"],
      Institución: ["UM"]
    }
  }
  // Puedes agregar 5 más si quieres completar 15
];

const filterConfig = {
  Especie: ["Ovina", "Caprina", "Vacuna", "Porcina", "Avícola", "Cunícula"],
  Tecnología: ["Identificación y monitorización", "Detección y medición", "Biosensores", "Psicionamiento y navegación", "Automatización y robots", "Análisis de imágenes", "Ciencia de datos"],
  Líneas: ["Salud animal", "Optimización de recursos", "Comportamineto animal", "Monitoreo de emisiones", "Reproducción y mejora genética"],
  Rol: ["IP", "Postdoc", "Predoc", "Técnico", "Asesor científico"],
  Institución: ["CICYTEX", "CSIC/INIA", "IRTA", "IUCA", "NEIKER", "UAB", "UCO", "UdL/Agrotecnio", "UM", "USAL", "USC/Campus Terra", "UPV"]
};

const selected = {
  Especie: new Set(),
  Tecnología: new Set(),
  Líneas: new Set(),
  Rol: new Set(),
  Institución: new Set()
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
    const formFieldsContainer = document.getElementById('form-fields-container');

    function renderFiltersAndForm() {
        filtersContainer.innerHTML = '';
        formFieldsContainer.innerHTML = '';

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

            // Crear campos de selección en el formulario CRUD
            const formFieldGroup = document.createElement('div');
            let selectHTML = `<label for="form-${key}">${category}:</label><select id="form-${key}" multiple>`;
            options.forEach(option => {
                selectHTML += `<option value="${option}">${option}</option>`;
            });
            selectHTML += `</select>`;
            formFieldGroup.innerHTML = selectHTML;
            formFieldsContainer.appendChild(formFieldGroup);
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
                loadPersonInForm(personId);
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
            if (p.status === 'IP') {
                institutionGroups[p.institucion].ip.push(p);
            } else {
                institutionGroups[p.institucion].others.push(p);
            }
        });

        filteredPeople.forEach(person => {
            let isSatellite = false;
            const group = institutionGroups[person.institucion];
            if (group && group.ip.length > 0 && person.status !== 'IP') {
                isSatellite = true;
            }

            nodes.push({
                id: person.id,
                label: person.nombre,
                title: `${person.nombre} (${person.status} en ${person.institucion})`,
                value: person.status === 'IP' ? 30 : 15, // Tamaño del nodo
                mass: person.status === 'IP' ? 5 : 1, // 'Peso' para la física
                color: isSatellite ? '#f4a261' : (person.status === 'IP' ? '#e76f51' : '#2a9d8f')
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
        
        Object.keys(filterConfig).forEach(cat => {
            const key = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const val1 = p1[key] || [];
            const val2 = p2[key] || [];
            if (Array.isArray(val1) && Array.isArray(val2)) {
                const shared = val1.filter(v => val2.includes(v));
                if (shared.length > 0) common.push(...shared);
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
