// Sample data for 15 people
const peopleData = [
    {
        id: 1,
        name: "Ana García",
        especie: ["Ovina", "Caprina"],
        tecnologia: ["Identificación y monitorización", "Biosensores"],
        lineas: ["Salud animal"],
        rol: ["IP"],
        institucion: ["CICYTEX"]
    },
    {
        id: 2,
        name: "Carlos Ruiz",
        especie: ["Vacuna"],
        tecnologia: ["Detección y medición", "Análisis de imágenes"],
        lineas: ["Comportamiento animal", "Salud animal"],
        rol: ["Postdoc"],
        institucion: ["CICYTEX"]
    },
    {
        id: 3,
        name: "María López",
        especie: ["Porcina", "Avícola"],
        tecnologia: ["Automatización y robots", "Ciencia de datos"],
        lineas: ["Optimización de recursos"],
        rol: ["IP"],
        institucion: ["CSIC/INIA"]
    },
    {
        id: 4,
        name: "Diego Martín",
        especie: ["Cunícula"],
        tecnologia: ["Posicionamiento y navegación"],
        lineas: ["Monitoreo de emisiones"],
        rol: ["Predoc"],
        institucion: ["CSIC/INIA"]
    },
    {
        id: 5,
        name: "Laura Sánchez",
        especie: ["Ovina", "Vacuna"],
        tecnologia: ["Biosensores", "Identificación y monitorización"],
        lineas: ["Reproducción y mejora genética", "Salud animal"],
        rol: ["IP"],
        institucion: ["IRTA"]
    },
    {
        id: 6,
        name: "Javier Torres",
        especie: ["Caprina"],
        tecnologia: ["Análisis de imágenes"],
        lineas: ["Comportamiento animal"],
        rol: ["Técnico"],
        institucion: ["IRTA"]
    },
    {
        id: 7,
        name: "Carmen Flores",
        especie: ["Porcina"],
        tecnologia: ["Ciencia de datos", "Automatización y robots"],
        lineas: ["Optimización de recursos", "Monitoreo de emisiones"],
        rol: ["Postdoc"],
        institucion: ["IUCA"]
    },
    {
        id: 8,
        name: "Roberto Silva",
        especie: ["Avícola", "Vacuna"],
        tecnologia: ["Detección y medición"],
        lineas: ["Salud animal"],
        rol: ["IP"],
        institucion: ["NEIKER"]
    },
    {
        id: 9,
        name: "Elena Morales",
        especie: ["Ovina"],
        tecnologia: ["Posicionamiento y navegación", "Biosensores"],
        lineas: ["Comportamiento animal"],
        rol: ["Asesor científico"],
        institucion: ["NEIKER"]
    },
    {
        id: 10,
        name: "Pablo Herrera",
        especie: ["Cunícula", "Caprina"],
        tecnologia: ["Identificación y monitorización"],
        lineas: ["Reproducción y mejora genética"],
        rol: ["Predoc"],
        institucion: ["UAB"]
    },
    {
        id: 11,
        name: "Isabel Romero",
        especie: ["Vacuna", "Porcina"],
        tecnologia: ["Análisis de imágenes", "Ciencia de datos"],
        lineas: ["Optimización de recursos", "Salud animal"],
        rol: ["IP"],
        institucion: ["UCO"]
    },
    {
        id: 12,
        name: "Miguel Castillo",
        especie: ["Avícola"],
        tecnologia: ["Automatización y robots"],
        lineas: ["Monitoreo de emisiones"],
        rol: ["Postdoc"],
        institucion: ["UCO"]
    },
    {
        id: 13,
        name: "Rocío Vega",
        especie: ["Ovina", "Cunícula"],
        tecnologia: ["Biosensores", "Detección y medición"],
        lineas: ["Salud animal", "Reproducción y mejora genética"],
        rol: ["Técnico"],
        institucion: ["UdL/Agrotecnio"]
    },
    {
        id: 14,
        name: "Andrés Peña",
        especie: ["Caprina", "Vacuna"],
        tecnologia: ["Posicionamiento y navegación", "Identificación y monitorización"],
        lineas: ["Comportamiento animal"],
        rol: ["IP"],
        institucion: ["UM"]
    },
    {
        id: 15,
        name: "Lucía Guerrero",
        especie: ["Porcina", "Avícola"],
        tecnologia: ["Ciencia de datos"],
        lineas: ["Optimización de recursos", "Monitoreo de emisiones"],
        rol: ["Predoc"],
        institucion: ["UM"]
    }
];

let currentFilters = {
    especie: [],
    tecnologia: [],
    lineas: [],
    rol: [],
    institucion: []
};

let simulation, svg, g;

function toggleField(fieldName) {
    const content = document.getElementById(fieldName + '-content');
    const arrow = content.previousElementSibling.querySelector('.arrow');
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('show');
        arrow.style.transform = 'rotate(180deg)';
    }
}

function updateFilter() {
    // Reset filters
    currentFilters = {
        especie: [],
        tecnologia: [],
        lineas: [],
        rol: [],
        institucion: []
    };

    // Collect selected filters
    Object.keys(currentFilters).forEach(field => {
        const checkboxes = document.querySelectorAll(`#${field}-content input[type="checkbox"]:checked`);
        currentFilters[field] = Array.from(checkboxes).map(cb => cb.value);
    });

    updateVisualization();
}

function getFilteredPeople() {
    if (Object.values(currentFilters).every(arr => arr.length === 0)) {
        return peopleData; // Show all if no filters selected
    }

    return peopleData.filter(person => {
        return Object.keys(currentFilters).some(field => {
            if (currentFilters[field].length === 0) return false;
            return currentFilters[field].some(filter => 
                person[field].includes(filter)
            );
        });
    });
}

function getConnections(people) {
    const connections = [];
    const connectionLabels = [];

    for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
            const person1 = people[i];
            const person2 = people[j];
            const sharedFields = [];

            // Check for shared attributes
            Object.keys(currentFilters).forEach(field => {
                if (currentFilters[field].length > 0) {
                    const shared = person1[field].filter(item => person2[field].includes(item));
                    if (shared.length > 0) {
                        sharedFields.push(...shared);
                    }
                }
            });

            if (sharedFields.length > 0) {
                connections.push({
                    source: person1.id,
                    target: person2.id,
                    value: sharedFields.length
                });
                connectionLabels.push({
                    source: person1.id,
                    target: person2.id,
                    label: sharedFields[0] // Show first shared field
                });
            }
        }
    }

    return { connections, connectionLabels };
}

function initVisualization() {
    const container = document.getElementById('network-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg = d3.select('#network-svg')
        .attr('width', width)
        .attr('height', height);

    g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    updateVisualization();
}

function updateVisualization() {
    const filteredPeople = getFilteredPeople();
    const { connections, connectionLabels } = getConnections(filteredPeople);

    // Clear previous visualization
    g.selectAll('*').remove();

    if (filteredPeople.length === 0) return;

    const width = svg.attr('width');
    const height = svg.attr('height');

    // Create force simulation
    simulation = d3.forceSimulation(filteredPeople)
        .force('link', d3.forceLink(connections).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));

    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(connections)
        .enter().append('line')
        .attr('class', 'link');

    // Create link labels
    const linkLabel = g.append('g')
        .selectAll('text')
        .data(connectionLabels)
        .enter().append('text')
        .attr('class', 'link-label')
        .text(d => d.label);

    // Create nodes
    const node = g.append('g')
        .selectAll('circle')
        .data(filteredPeople)
        .enter().append('circle')
        .attr('class', d => {
            if (d.rol.includes('IP')) return 'node node-ip';
            
            // Check if this person is from same institution as an IP
            const sameInstitutionIPs = filteredPeople.filter(p => 
                p.rol.includes('IP') && 
                p.institucion.some(inst => d.institucion.includes(inst))
            );
            
            if (sameInstitutionIPs.length > 0 && !d.rol.includes('IP')) {
                return 'node node-satellite';
            }
            
            return 'node node-regular';
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('click', showPersonDetails);

    // Create node labels
    const nodeLabel = g.append('g')
        .selectAll('text')
        .data(filteredPeople)
        .enter().append('text')
        .attr('class', 'node-label')
        .text(d => d.name.split(' ')[0]) // Show first name only
        .attr('dy', 5);

    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        linkLabel
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        nodeLabel
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function showPersonDetails(event, person) {
    const modal = document.getElementById('person-modal');
    const modalName = document.getElementById('modal-name');
    const modalDetails = document.getElementById('modal-details');

    modalName.textContent = person.name;
    
    let detailsHTML = '';
    Object.keys(person).forEach(field => {
        if (field !== 'id' && field !== 'name') {
            detailsHTML += `
                <div class="modal-section">
                    <h4>${field.charAt(0).toUpperCase() + field.slice(1)}</h4>
                    <ul>
                        ${person[field].map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    });

    modalDetails.innerHTML = detailsHTML;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('person-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('person-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Initialize visualization when page loads
window.addEventListener('load', () => {
    initVisualization();
});

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('network-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg.attr('width', width).attr('height', height);
    
    if (simulation) {
        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        simulation.alpha(0.3).restart();
    }
});