document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS INICIALES ---
    const initialPeopleData = [
        { id: 1, nombre: 'Ana García', especie: ['Ovina', 'Caprina'], dispositivos: ['RFID', 'Collares'], estudio: ['Comportamiento social'], proyectos: ['Project1', 'Project2'], status: 'IP', institucion: 'UPV' },
        { id: 2, nombre: 'Bruno Soler', especie: ['Ovina'], dispositivos: ['RFID', 'Drones'], estudio: ['Manejo'], proyectos: ['Project1'], status: 'Postdoc', institucion: 'UPV' },
        { id: 3, nombre: 'Carla Pons', especie: ['Caprina'], dispositivos: ['Collares', 'Cámaras de visión'], estudio: ['Comportamiento social'], proyectos: ['Project2'], status: 'Predoc', institucion: 'UPV' },
        { id: 4, nombre: 'David Roca', especie: ['Porcina'], dispositivos: ['IA', 'Alimentadores automáticos'], estudio: ['Nutrición'], proyectos: ['Project3'], status: 'IP', institucion: 'UdL' },
        { id: 5, nombre: 'Elena Ferré', especie: ['Porcina', 'Avícola'], dispositivos: ['Alimentadores automáticos', 'Básculas'], estudio: ['Nutrición'], proyectos: ['Project3'], status: 'Técnico', institucion: 'UdL' },
        { id: 6, nombre: 'Felipe Sanz', especie: ['Vacuna'], dispositivos: ['Collares', 'Vallados virtuales'], estudio: ['Comportamiento alimenticio'], proyectos: ['Project4'], status: 'IP', institucion: 'UCO' },
        { id: 7, nombre: 'Gloria Mínguez', especie: ['Vacuna'], dispositivos: ['Collares', 'Sensores de movimiento'], estudio: ['Salud'], proyectos: ['Project4'], status: 'Postdoc', institucion: 'UCO' },
        { id: 8, nombre: 'Hector Blanes', especie: ['Ovina'], dispositivos: ['Cámaras de visión', 'IA'], estudio: ['Comportamiento social'], proyectos: ['Project2'], status: 'Predoc', institucion: 'USAL' },
        { id: 9, nombre: 'Irene Jiménez', especie: ['Ovina', 'Cunícula'], dispositivos: ['Sensores acústicos', 'RFID'], estudio: ['Manejo'], proyectos: ['Project2', 'Project4'], status: 'IP', institucion: 'USAL' },
        { id: 10, nombre: 'Javier Luna', especie: ['Avícola'], dispositivos: ['Básculas', 'Drones'], estudio: ['Nutrición'], proyectos: [], status: 'Técnico', institucion: 'UAB' },
        { id: 11, nombre: 'Laura Vidal', especie: ['Avícola', 'Porcina'], dispositivos: ['Drones', 'IA'], estudio: ['Manejo'], proyectos: ['Project1', 'Project3'], status: 'IP', institucion: 'UAB' },
        { id: 12, nombre: 'Marco Rubio', especie: ['Caprina'], dispositivos: ['Sensores de movimiento', 'Vallados virtuales'], estudio: ['Salud'], proyectos: ['Project1'], status: 'Postdoc', institucion: 'UPV' },
        { id: 13, nombre: 'Nora Casado', especie: ['Porcina'], dispositivos: ['IA', 'Cámaras de visión'], estudio: ['Comportamiento social'], proyectos: ['Project3'], status: 'Predoc', institucion: 'UdL' },
        { id: 14, nombre: 'Oscar Pardo', especie: ['Vacuna'], dispositivos: ['RFID', 'Básculas'], estudio: ['Nutrición'], proyectos: ['Project4'], status: 'Técnico', institucion: 'UCO' },
        { id: 15, nombre: 'Paula Navarro', especie: ['Caprina', 'Vacuna'], dispositivos: ['Collares', 'Cámaras de visión'], estudio: ['Comportamiento alimenticio'], proyectos: ['Project1', 'Project4'], status: 'IP', institucion: 'UCO' }
    ];

    const filterConfig = {
        'Especie': ['Ovina', 'Caprina', 'Vacuna', 'Porcina', 'Avícola', 'Cunícula'],
        'Dispositivos': ['Drones', 'RFID', 'Collares', 'Cámaras de visión', 'IA', 'Alimentadores automáticos', 'Básculas', 'Sensores acústicos', 'Sensores de movimiento', 'Vallados virtuales'],
        'Estudio': ['Comportamiento alimenticio', 'Comportamiento social', 'Manejo', 'Nutrición', 'Salud'],
        'Proyectos': ['Project1', 'Project2', 'Project3', 'Project4'],
        'Status': ['IP', 'Predoc', 'Postdoc', 'Técnico'],
        'Institución': ['UPV', 'UdL', 'UCO', 'USAL', 'UAB']
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


    // --- LÓGICA DEL FORMULARIO CRUD ---
    const form = document.getElementById('person-form');
    const personIdInput = document.getElementById('person-id');
    const personNameInput = document.getElementById('person-name');

    function loadPersonInForm(personId) {
        const person = peopleData.find(p => p.id === personId);
        if (!person) return;

        clearForm();
        personIdInput.value = person.id;
        personNameInput.value = person.nombre;
        
        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const personValue = person[key] || [];
            const valuesToSelect = Array.isArray(personValue) ? personValue : [personValue];
            
            for (const option of select.options) {
                option.selected = valuesToSelect.includes(option.value);
            }
        }
    }

    function clearForm() {
        form.reset();
        personIdInput.value = '';
        document.querySelectorAll('#form-fields-container select').forEach(select => {
            Array.from(select.options).forEach(opt => opt.selected = false);
        });
    }

    function handleCreate() {
        if (!personNameInput.value) {
            alert('El nombre es obligatorio.');
            return;
        }

        const newId = peopleData.length > 0 ? Math.max(...peopleData.map(p => p.id)) + 1 : 1;
        const newPerson = { id: newId, nombre: personNameInput.value };

        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const values = Array.from(select.selectedOptions).map(opt => opt.value);
            // Si la categoría no es de selección múltiple (ej. Status, Institución), tomar solo el primer valor.
            // En esta configuración, todas son `multiple` para consistencia, pero se podría adaptar.
            newPerson[key] = values; 
        }
        
        // Simplificación: Status e Institución no deberían ser multi-selección.
        newPerson['status'] = newPerson['status'][0] || '';
        newPerson['institucion'] = newPerson['institucion'][0] || '';


        peopleData.push(newPerson);
        saveData();
        updateVisualization();
        clearForm();
    }

    function handleUpdate() {
        const idToUpdate = parseInt(personIdInput.value);
        if (!idToUpdate) {
            alert('Selecciona una persona de la red para modificar.');
            return;
        }

        const personIndex = peopleData.findIndex(p => p.id === idToUpdate);
        if (personIndex === -1) return;
        
        const updatedPerson = { id: idToUpdate, nombre: personNameInput.value };
        for (const category in filterConfig) {
            const key = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const select = document.getElementById(`form-${key}`);
            const values = Array.from(select.selectedOptions).map(opt => opt.value);
            updatedPerson[key] = values;
        }
        
        updatedPerson['status'] = updatedPerson['status'][0] || '';
        updatedPerson['institucion'] = updatedPerson['institucion'][0] || '';

        peopleData[personIndex] = updatedPerson;
        saveData();
        updateVisualization();
        showPersonInfo(idToUpdate); // Actualizar tarjeta de info
    }

    function handleDelete() {
        const idToDelete = parseInt(personIdInput.value);
        if (!idToDelete) {
            alert('Selecciona una persona de la red para eliminar.');
            return;
        }
        
        if (confirm(`¿Seguro que quieres eliminar a ${peopleData.find(p=>p.id === idToDelete).nombre}?`)) {
            peopleData = peopleData.filter(p => p.id !== idToDelete);
            saveData();
            updateVisualization();
            clearForm();
            hidePersonInfo();
        }
    }


    // --- INICIALIZACIÓN Y EVENT LISTENERS ---
    loadData();
    renderFiltersAndForm();
    initializeNetwork();
    updateVisualization();

    document.getElementById('filters-container').addEventListener('change', updateVisualization);
    document.getElementById('close-card-btn').addEventListener('click', hidePersonInfo);
    
    document.getElementById('create-btn').addEventListener('click', handleCreate);
    document.getElementById('update-btn').addEventListener('click', handleUpdate);
    document.getElementById('delete-btn').addEventListener('click', handleDelete);
    document.getElementById('clear-form-btn').addEventListener('click', clearForm);
});
