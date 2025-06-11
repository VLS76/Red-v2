document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo de personas
    const allPeople = [
        {
            id: 1,
            name: "Dr. Ana Pérez",
            especie: ["Ovina", "Caprina"],
            tecnologia: ["Identificación y monitorización", "Detección y medición"],
            lineas: ["Salud animal"],
            rol: "IP",
            institucion: "CICYTEX"
        },
        {
            id: 2,
            name: "Dr. Juan García",
            especie: ["Vacuna", "Porcina"],
            tecnologia: ["Biosensores", "Automatización y robots"],
            lineas: ["Optimización de recursos", "Monitoreo de emisiones"],
            rol: "IP",
            institucion: "CSIC/INIA"
        },
        {
            id: 3,
            name: "Dra. Laura Soto",
            especie: ["Avícola"],
            tecnologia: ["Análisis de imágenes", "Ciencia de datos"],
            lineas: ["Comportamiento animal"],
            rol: "Postdoc",
            institucion: "CICYTEX"
        },
        {
            id: 4,
            name: "Carlos Ruiz",
            especie: ["Cunícula"],
            tecnologia: ["Identificación y monitorización"],
            lineas: ["Reproducción y mejora genética"],
            rol: "Predoc",
            institucion: "CSIC/INIA"
        },
        {
            id: 5,
            name: "Elena Marín",
            especie: ["Ovina"],
            tecnologia: ["Detección y medición"],
            lineas: ["Salud animal"],
            rol: "Técnico",
            institucion: "IRTA"
        },
        {
            id: 6,
            name: "Dr. Miguel Torres",
            especie: ["Vacuna"],
            tecnologia: ["Posicionamiento y navegación"],
            lineas: ["Optimización de recursos"],
            rol: "IP",
            institucion: "IRTA"
        },
        {
            id: 7,
            name: "Sofía Vargas",
            especie: ["Porcina"],
            tecnologia: ["Automatización y robots"],
            lineas: ["Comportamiento animal"],
            rol: "Postdoc",
            institucion: "IUCA"
        },
        {
            id: 8,
            name: "David Castro",
            especie: ["Avícola"],
            tecnologia: ["Ciencia de datos"],
            lineas: ["Monitoreo de emisiones"],
            rol: "Predoc",
            institucion: "NEIKER"
        },
        {
            id: 9,
            name: "María López",
            especie: ["Ovina", "Vacuna"],
            tecnologia: ["Biosensores"],
            lineas: ["Salud animal", "Optimización de recursos"],
            rol: "Técnico",
            institucion: "UAB"
        },
        {
            id: 10,
            name: "Dr. Pablo Gil",
            especie: ["Caprina"],
            tecnologia: ["Identificación y monitorización"],
            lineas: ["Reproducción y mejora genética"],
            rol: "IP",
            institucion: "UCO"
        },
        {
            id: 11,
            name: "Lucía Núñez",
            especie: ["Porcina"],
            tecnologia: ["Detección y medición"],
            lineas: ["Comportamiento animal"],
            rol: "Postdoc",
            institucion: "UdL/Agrotecnio"
        },
        {
            id: 12,
            name: "Javier Serrano",
            especie: ["Cunícula"],
            tecnologia: ["Análisis de imágenes"],
            lineas: ["Salud animal"],
            rol: "Predoc",
            institucion: "UM"
        },
        {
            id: 13,
            name: "Dr. Isabel Ramos",
            especie: ["Avícola", "Vacuna"],
            tecnologia: ["Posicionamiento y navegación"],
            lineas: ["Monitoreo de emisiones"],
            rol: "IP",
            institucion: "USAL"
        },
        {
            id: 14,
            name: "Fernando Rojas",
            especie: ["Ovina"],
            tecnologia: ["Automatización y robots"],
            lineas: ["Optimización de recursos"],
            rol: "Asesor científico",
            institucion: "USC/Campus Terra"
        },
        {
            id: 15,
            name: "Dra. Andrea Morales",
            especie: ["Caprina", "Porcina"],
            tecnologia: ["Ciencia de datos"],
            lineas: ["Reproducción y mejora genética"],
            rol: "IP",
            institucion: "UPV"
        }
    ];

    const filterGroups = document.querySelectorAll('.filter-group');
    const checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
    const networkContainer = document.getElementById('network');
    const personInfoBox = document.getElementById('person-info-box');

    let network = null; // Variable para almacenar la instancia de la red Vis.js

    // Función para alternar la visibilidad de los desplegables
    filterGroups.forEach(group => {
        const label = group.querySelector('label');
        label.addEventListener('click', () => {
            group.classList.toggle('active');
        });
    });

    // Añadir event listeners a los checkboxes para actualizar la red al instante
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateNetwork);
    });

    // Función para obtener los filtros seleccionados
    function getSelectedFilters() {
        const selectedFilters = {
            especie: [],
            tecnologia: [],
            lineas: [],
            rol: [],
            institucion: []
        };

        document.querySelectorAll('#especie-dropdown input:checked').forEach(cb => selectedFilters.especie.push(cb.value));
        document.querySelectorAll('#tecnologia-dropdown input:checked').forEach(cb => selectedFilters.tecnologia.push(cb.value));
        document.querySelectorAll('#lineas-dropdown input:checked').forEach(cb => selectedFilters.lineas.push(cb.value));
        document.querySelectorAll('#rol-dropdown input:checked').forEach(cb => selectedFilters.rol.push(cb.value));
        document.querySelectorAll('#institucion-dropdown input:checked').forEach(cb => selectedFilters.institucion.push(cb.value));

        return selectedFilters;
    }

    // Función para filtrar personas
    function filterPeople(filters) {
        if (Object.values(filters).every(arr => arr.length === 0)) {
            return allPeople; // Si no hay filtros seleccionados, mostrar todas las personas
        }

        return allPeople.filter(person => {
            let matches = false;

            // Verificar si la persona tiene AL MENOS UN indicador seleccionado en CUALQUIER campo
            if (filters.especie.length > 0 && person.especie.some(e => filters.especie.includes(e))) {
                matches = true;
            }
            if (!matches && filters.tecnologia.length > 0 && person.tecnologia.some(t => filters.tecnologia.includes(t))) {
                matches = true;
            }
            if (!matches && filters.lineas.length > 0 && person.lineas.some(l => filters.lineas.includes(l))) {
                matches = true;
            }
            if (!matches && filters.rol.length > 0 && filters.rol.includes(person.rol)) {
                matches = true;
            }
            if (!matches && filters.institucion.length > 0 && filters.institucion.includes(person.institucion)) {
                matches = true;
            }

            return matches;
        });
    }

    // Función para dibujar la red
    function drawNetwork(filteredPeople) {
        // Limpiar la red existente si hay una
        if (network !== null) {
            network.destroy();
        }

        const nodes = [];
        const edges = [];
        const institutionGroups = {}; // Para agrupar personas por institución

        filteredPeople.forEach(person => {
            if (!institutionGroups[person.institucion]) {
                institutionGroups[person.institucion] = [];
            }
            institutionGroups[person.institucion].push(person);
        });

        // Crear nodos para las personas
        for (const institution in institutionGroups) {
            const peopleInInstitution = institutionGroups[institution];
            const ipsInInstitution = peopleInInstitution.filter(p => p.rol === 'IP');

            peopleInInstitution.forEach(person => {
                let size = 20;
                let color = '#7BE141'; // Color por defecto

                // Si hay IPs en la misma institución y la persona no es IP, reducir su tamaño
                if (ipsInInstitution.length > 0 && person.rol !== 'IP') {
                    size = 15; // Tamaño ligeramente menor
                    color = '#f0a202'; // Otro color para no-IPs satelitales
                } else if (person.rol === 'IP') {
                    color = '#e04000'; // Color distintivo para IPs
                }

                nodes.push({
                    id: person.id,
                    label: person.name,
                    shape: 'dot',
                    size: size,
                    color: color,
                    font: { color: '#333' }
                });
            });

            // Crear conexiones dentro de la misma institución (IPs con no-IPs)
            if (ipsInInstitution.length > 0) {
                ipsInInstitution.forEach(ip => {
                    peopleInInstitution.forEach(otherPerson => {
                        if (ip.id !== otherPerson.id) {
                            edges.push({
                                from: ip.id,
                                to: otherPerson.id,
                                arrows: 'to',
                                dashes: true,
                                color: { color: '#888', highlight: '#f04' },
                                title: `Conexión por institución: ${institution}`
                            });
                        }
                    });
                });
            }
        }

        // Crear conexiones basadas en indicadores compartidos entre todas las personas filtradas
        for (let i = 0; i < filteredPeople.length; i++) {
            for (let j = i + 1; j < filteredPeople.length; j++) {
                const p1 = filteredPeople[i];
                const p2 = filteredPeople[j];

                const sharedConnections = [];

                // Comparar Especie
                const sharedEspecie = p1.especie.filter(e => p2.especie.includes(e));
                if (sharedEspecie.length > 0) {
                    sharedConnections.push(`Especie: ${sharedEspecie.join(', ')}`);
                }
                // Comparar Tecnología
                const sharedTecnologia = p1.tecnologia.filter(t => p2.tecnologia.includes(t));
                if (sharedTecnologia.length > 0) {
                    sharedConnections.push(`Tecnología: ${sharedTecnologia.join(', ')}`);
                }
                // Comparar Líneas
                const sharedLineas = p1.lineas.filter(l => p2.lineas.includes(l));
                if (sharedLineas.length > 0) {
                    sharedConnections.push(`Líneas: ${sharedLineas.join(', ')}`);
                }
                // Comparar Rol (solo si son el mismo rol)
                if (p1.rol === p2.rol) {
                    sharedConnections.push(`Rol: ${p1.rol}`);
                }
                // Comparar Institución
                if (p1.institucion === p2.institucion) {
                    sharedConnections.push(`Institución: ${p1.institucion}`);
                }

                if (sharedConnections.length > 0) {
                    edges.push({
                        from: p1.id,
                        to: p2.id,
                        color: { color: '#007BFF' }, // Color para conexiones de indicadores
                        title: `Comparten: ${sharedConnections.join('; ')}`
                    });
                }
            }
        }


        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };

        const options = {
            nodes: {
                borderWidth: 2,
                font: {
                    size: 12,
                    color: '#333'
                }
            },
            edges: {
                width: 1,
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.3,
                    springLength: 95,
                    springConstant: 0.04,
                    damping: 0.09,
                    avoidOverlap: 0.5
                },
                solver: 'barnesHut'
            },
            interaction: {
                hover: true,
                tooltipDelay: 300
            }
        };

        network = new vis.Network(networkContainer, data, options);

        // Evento click en un nodo para mostrar información de la persona
        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const person = allPeople.find(p => p.id === nodeId);
                if (person) {
                    displayPersonInfo(person, params.pointer.DOM);
                }
            } else {
                personInfoBox.style.display = 'none';
            }
        });

        // Ocultar info box al hacer click fuera
        network.on("click", function (params) {
            if (params.nodes.length === 0 && params.edges.length === 0) {
                personInfoBox.style.display = 'none';
            }
        });

        // Ocultar info box cuando el puntero se mueve fuera de un nodo si el box está abierto
        network.on("hoverNode", function (params) {
            // No ocultar el box al hacer hover, solo al hacer click fuera o en otro nodo
        });

        network.on("blurNode", function (params) {
            // No ocultar el box al salir del nodo, el click manejará la visibilidad
        });
    }

    // Función para mostrar la información de la persona en un recuadro
    function displayPersonInfo(person, clickCoordinates) {
        personInfoBox.innerHTML = `
            <h3>${person.name}</h3>
            <p><strong>Institución:</strong> ${person.institucion}</p>
            <p><strong>Rol:</strong> ${person.rol}</p>
            <p><strong>Especie:</strong> ${person.especie.join(', ')}</p>
            <p><strong>Tecnología:</strong> ${person.tecnologia.join(', ')}</p>
            <p><strong>Líneas:</strong> ${person.lineas.join(', ')}</p>
        `;
        personInfoBox.style.display = 'block';
        // Posicionar la caja cerca del clic, pero centrado para evitar desbordamiento
        personInfoBox.style.left = `${clickCoordinates.x}px`;
        personInfoBox.style.top = `${clickCoordinates.y}px`;
        personInfoBox.style.transform = `translate(-50%, -50%)`; // Centrar el tooltip en el punto de clic
    }


    // Función principal para actualizar la red
    function updateNetwork() {
        const selectedFilters = getSelectedFilters();
        const filtered = filterPeople(selectedFilters);
        drawNetwork(filtered);
    }

    // Inicializar la red con todas las personas al cargar la página
    updateNetwork();
});