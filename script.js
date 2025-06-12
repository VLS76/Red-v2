// Data for fields and their indicators
const fieldsData = {
    'Especie': ['Ovina', 'Caprina', 'Vacuna', 'Porcina', 'Avícola', 'Cunícula'],
    'Tecnología': ['Identificación y monitorización', 'Detección y medición', 'Biosensores', 'Posicionamiento y navegación', 'Automatización y robots', 'Analisis de imágenes', 'Ciencia de datos'],
    'Lineas': ['Salud animal', 'Optimización de recursos', 'Comportamiento animal', 'Monitoreo de emisiones', 'Reproducción y mejora genética'],
    'Rol': ['IP', 'Postdoc', 'Predoc', 'Técnico', 'Asesor científico'],
    'Institución': ['CICYTEX', 'CSIC/INIA', 'IRTA', 'IUCA', 'NEIKER', 'UAB', 'UCO', 'UdL/Agrotecnio', 'UM', 'USAL', 'USC/Campus Terra', 'UPV']
};

// Example data for 15 people with various indicators
const people = [
    {
        id: 'p1', name: 'Juan Perez',
        especie: ['Ovina', 'Caprina'], tecnologia: ['Identificación y monitorización', 'Detección y medición'],
        lineas: ['Salud animal'], rol: 'IP', institucion: 'CSIC/INIA'
    },
    {
        id: 'p2', name: 'Maria Garcia',
        especie: ['Vacuna'], tecnologia: ['Detección y medición', 'Biosensores'],
        lineas: ['Optimización de recursos'], rol: 'Postdoc', institucion: 'CSIC/INIA'
    },
    {
        id: 'p3', name: 'Carlos Lopez',
        especie: ['Porcina'], tecnologia: ['Automatización y robots'],
        lineas: ['Comportamiento animal'], rol: 'Predoc', institucion: 'CSIC/INIA'
    },
    {
        id: 'p4', name: 'Ana Martinez',
        especie: ['Avícola'], tecnologia: ['Analisis de imágenes', 'Ciencia de datos'],
        lineas: ['Monitoreo de emisiones'], rol: 'IP', institucion: 'IRTA'
    },
    {
        id: 'p5', name: 'Pedro Sanchez',
        especie: ['Cunícula'], tecnologia: ['Posicionamiento y navegación'],
        lineas: ['Reproducción y mejora genética'], rol: 'Técnico', institucion: 'IRTA'
    },
    {
        id: 'p6', name: 'Laura Rodriguez',
        especie: ['Ovina'], tecnologia: ['Identificación y monitorización'],
        lineas: ['Salud animal'], rol: 'IP', institucion: 'NEIKER'
    },
    {
        id: 'p7', name: 'David Gomez',
        especie: ['Caprina'], tecnologia: ['Biosensores'],
        lineas: ['Optimización de recursos'], rol: 'Postdoc', institucion: 'NEIKER'
    },
    {
        id: 'p8', name: 'Sara Fernandez',
        especie: ['Vacuna'], tecnologia: ['Detección y medición'],
        lineas: ['Comportamiento animal'], rol: 'Técnico', institucion: 'UAB'
    },
    {
        id: 'p9', name: 'Pablo Ruiz',
        especie: ['Porcina', 'Avícola'], tecnologia: ['Ciencia de datos'],
        lineas: ['Monitoreo de emisiones'], rol: 'IP', institucion: 'UAB'
    },
    {
        id: 'p10', name: 'Elena Diaz',
        especie: ['Cunícula'], tecnologia: ['Automatización y robots'],
        lineas: ['Reproducción y mejora genética'], rol: 'Asesor científico', institucion: 'UCO'
    },
    {
        id: 'p11', name: 'Miguel Angel',
        especie: ['Ovina', 'Vacuna'], tecnologia: ['Identificación y monitorización'],
        lineas: ['Salud animal'], rol: 'IP', institucion: 'UCO'
    },
    {
        id: 'p12', name: 'Julia Torres',
        especie: ['Caprina'], tecnologia: ['Biosensores'],
        lineas: ['Optimización de recursos'], rol: 'Postdoc', institucion: 'UCO'
    },
    {
        id: 'p13', name: 'Ricardo Perez',
        especie: ['Porcina'], tecnologia: ['Posicionamiento y navegación'],
        lineas: ['Comportamiento animal'], rol: 'IP', institucion: 'UM'
    },
    {
        id: 'p14', name: 'Sofia Castro',
        especie: ['Avícola'], tecnologia: ['Analisis de imágenes'],
        lineas: ['Monitoreo de emisiones'], rol: 'Predoc', institucion: 'UM'
    },
    {
        id: 'p15', name: 'Hector Leon',
        especie: ['Ovina'], tecnologia: ['Detección y medición'],
        lineas: ['Salud animal'], rol: 'Técnico', institucion: 'CSIC/INIA'
    }
];

// Object to store currently selected indicators
const selectedIndicators = {};
for (const field in fieldsData) {
    selectedIndicators[field] = new Set(); // Use Set for efficient lookup
}

// Map for tab border colors
const tabBorderColors = {
    'Especie': 'border-green-500',
    'Tecnología': 'border-blue-500',
    'Lineas': 'border-purple-500',
    'Rol': 'border-yellow-500',
    'Institución': 'border-red-500'
};

// D3.js setup
const svg = d3.select("#network-svg");
const networkContainer = document.getElementById("network-container");
let width = networkContainer.clientWidth;
let height = networkContainer.clientHeight;

// Update SVG dimensions on window resize
window.addEventListener('resize', () => {
    width = networkContainer.clientWidth;
    height = networkContainer.clientHeight;
    svg.attr("width", width).attr("height", height);
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
    simulation.alpha(0.3).restart(); // Restart simulation gently
});

// Initial SVG dimensions
svg.attr("width", width).attr("height", height);

// Create a group for links to be under nodes
const linkGroup = svg.append("g").attr("class", "links");
const linkLabelGroup = svg.append("g").attr("class", "link-labels");
const nodeGroup = svg.append("g").attr("class", "nodes");

// Force simulation
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(150).strength(0.8)) // Stronger links
    .force("charge", d3.forceManyBody().strength(-300)) // Repel nodes
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(30).strength(0.7)); // Prevent overlap

let currentNodes = [];
let currentLinks = [];

// Function to generate and update the D3.js graph
function updateGraph() {
    const filteredPeople = filterPeople();
    const { nodes, links } = generateGraphData(filteredPeople);

    // Hide/show "No results" message
    const noResultsDiv = document.getElementById("no-results");
    if (nodes.length === 0) {
        noResultsDiv.classList.remove("hidden");
    } else {
        noResultsDiv.classList.add("hidden");
    }

    currentNodes = nodes;
    currentLinks = links;

    // Update simulation forces with new data
    simulation.nodes(nodes);
    simulation.force("link").links(links);

    // Update links
    const link = linkGroup.selectAll("line")
        .data(links, d => d.id);

    link.exit().remove(); // Remove old links
    const newLinks = link.enter().append("line")
        .attr("class", "link"); // Add new links

    link.merge(newLinks); // Merge and apply updates

    // Update link labels
    const linkLabel = linkLabelGroup.selectAll("g")
        .data(links, d => d.id);

    linkLabel.exit().remove(); // Remove old labels

    const newLinkLabel = linkLabel.enter().append("g")
        .attr("class", "link-label-group");

    newLinkLabel.append("rect")
        .attr("class", "link-label-bg");
    newLinkLabel.append("text")
        .attr("class", "link-label-text");

    const mergedLinkLabel = linkLabel.merge(newLinkLabel);

    mergedLinkLabel.select(".link-label-text")
        .text(d => d.sharedFields.join(', ')); // Set text for link labels

    // Update nodes
    const node = nodeGroup.selectAll("g.node")
        .data(nodes, d => d.id);

    node.exit().remove(); // Remove old nodes

    const newNode = node.enter().append("g")
        .attr("class", d => `node ${d.rol === 'IP' ? 'ip-node' : 'non-ip-node'}`)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    newNode.append("circle")
        .attr("r", d => d.rol === 'IP' ? 20 : 12); // Larger radius for IP, smaller for others

    newNode.append("text")
        .attr("class", "node-text")
        .attr("dy", d => d.rol === 'IP' ? 25 : 17) // Position text below the circle
        .text(d => d.name.split(' ')[0]); // Display first name

    // Add click event listener to nodes for showing details
    newNode.on("click", (event, d) => showPersonDetails(d));

    node.merge(newNode)
        .select("circle")
        .attr("r", d => d.rol === 'IP' ? 20 : 12); // Ensure radius updates correctly

    // Update node class for styling (IP vs Non-IP)
    node.merge(newNode).attr("class", d => `node ${d.rol === 'IP' ? 'ip-node' : 'non-ip-node'}`);


    simulation.alpha(0.6).restart(); // Restart simulation with new data

    // Update positions on each tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.merge(newNode)
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Position link labels
        mergedLinkLabel.attr("transform", d => {
            const midX = (d.source.x + d.target.x) / 2;
            const midY = (d.source.y + d.target.y) / 2;
            return `translate(${midX},${midY})`;
        });

        // Adjust background rect for link labels based on text size
        mergedLinkLabel.select(".link-label-text").each(function(d) {
            const bbox = this.getBBox();
            d3.select(this.previousSibling) // Select the rect (previous sibling)
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 1)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 2);
        });
    });
}

// Drag functions for D3 nodes
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

// Filter people based on selected indicators
function filterPeople() {
    const activeFilters = Object.values(selectedIndicators).some(set => set.size > 0);

    if (!activeFilters) {
        return []; // If no filters are selected, return an empty array
    }

    return people.filter(person => {
        // A person is included if ANY of their indicators match ANY selected indicator across ANY field
        for (const field in fieldsData) {
            const personIndicators = person[field.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")]; // Convert field name to lowercase for property access (e.g., 'especie')
            if (personIndicators && selectedIndicators[field].size > 0) {
                // Check if any of the person's indicators for this field are in the selectedIndicators set
                if (Array.isArray(personIndicators) && personIndicators.some(ind => selectedIndicators[field].has(ind))) {
                    return true; // Match found, include person
                } else if (typeof personIndicators === 'string' && selectedIndicators[field].has(personIndicators)) {
                    return true; // Match found for single string indicator (like 'Rol' or 'Institucion')
                }
            }
        }
        return false; // No match found for this person
    });
}


// Generate nodes and links for the graph
function generateGraphData(filteredPeople) {
    const nodes = filteredPeople.map(p => ({ ...p })); // Deep copy nodes to avoid modifying original data
    const links = [];
    const linkMap = new Map(); // To prevent duplicate links between the same two nodes

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const p1 = nodes[i];
            const p2 = nodes[j];
            const sharedFields = [];

            for (const field in fieldsData) {
                const p1Indicators = p1[field.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")];
                const p2Indicators = p2[field.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")];

                if (p1Indicators && p2Indicators) {
                    const commonIndicators = [];
                    // Handle array indicators
                    if (Array.isArray(p1Indicators) && Array.isArray(p2Indicators)) {
                        p1Indicators.forEach(ind1 => {
                            if (p2Indicators.includes(ind1)) {
                                commonIndicators.push(ind1);
                            }
                        });
                    } else if (typeof p1Indicators === 'string' && typeof p2Indicators === 'string' && p1Indicators === p2Indicators) {
                        // Handle string indicators (Rol, Institucion)
                        commonIndicators.push(p1Indicators);
                    }

                    if (commonIndicators.length > 0) {
                        sharedFields.push(`${field}: ${commonIndicators.join(', ')}`);
                    }
                }
            }

            if (sharedFields.length > 0) {
                // Ensure unique link ID and prevent duplicates
                const linkId = [p1.id, p2.id].sort().join('-'); // Consistent ID for any pair
                if (!linkMap.has(linkId)) {
                    links.push({
                        id: linkId,
                        source: p1.id,
                        target: p2.id,
                        sharedFields: sharedFields
                    });
                    linkMap.set(linkId, true);
                }
            }
        }
    }
    return { nodes, links };
}

// Function to generate filter tabs dynamically
function generateFilterTabs() {
    const filterTabsDiv = document.getElementById('filter-tabs');
    filterTabsDiv.innerHTML = ''; // Clear previous content

    Object.keys(fieldsData).forEach(fieldName => {
        const fieldKey = fieldName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Used for internal data access

        const tabDiv = document.createElement('div');
        tabDiv.className = `collapsible-tab ${tabBorderColors[fieldName]}`; // Apply specific border color

        const headerDiv = document.createElement('div');
        headerDiv.className = 'collapsible-header';
        headerDiv.innerHTML = `
            <span class="text-lg">${fieldName}</span>
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        `;
        tabDiv.appendChild(headerDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'collapsible-content';

        fieldsData[fieldName].forEach(indicator => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            checkboxItem.innerHTML = `
                <input type="checkbox" id="${fieldKey}-${indicator.replace(/\s+/g, '-')}" value="${indicator}" class="cursor-pointer">
                <label for="${fieldKey}-${indicator.replace(/\s+/g, '-')}" class="cursor-pointer">${indicator}</label>
            `;
            const checkbox = checkboxItem.querySelector('input');
            checkbox.checked = selectedIndicators[fieldName].has(indicator); // Set initial checked state

            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    selectedIndicators[fieldName].add(indicator);
                } else {
                    selectedIndicators[fieldName].delete(indicator);
                }
                updateGraph(); // Update graph in real-time
            });
            contentDiv.appendChild(checkboxItem);
        });
        tabDiv.appendChild(contentDiv);
        filterTabsDiv.appendChild(tabDiv);

        // Add event listener for collapsing/expanding
        headerDiv.addEventListener('click', () => {
            headerDiv.classList.toggle('expanded');
            contentDiv.classList.toggle('expanded');
        });
    });
}

// Modal functions
const personDetailsModal = document.getElementById('person-details-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalPersonName = document.getElementById('modal-person-name');
const modalPersonDetails = document.getElementById('modal-person-details');

function showPersonDetails(person) {
    modalPersonName.textContent = person.name;
    modalPersonDetails.innerHTML = ''; // Clear previous details

    // Display each field's indicators
    for (const field in fieldsData) {
        const fieldKey = field.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const indicators = person[fieldKey];

        if (indicators && (Array.isArray(indicators) && indicators.length > 0 || typeof indicators === 'string')) {
            const detailItem = document.createElement('p');
            detailItem.innerHTML = `<strong>${field}:</strong> <span>${Array.isArray(indicators) ? indicators.join(', ') : indicators}</span>`;
            modalPersonDetails.appendChild(detailItem);
        }
    }

    personDetailsModal.classList.remove('hidden'); // Show the modal
}

closeModalBtn.addEventListener('click', () => {
    personDetailsModal.classList.add('hidden'); // Hide the modal
});

// Hide modal if clicked outside content
personDetailsModal.addEventListener('click', (event) => {
    if (event.target === personDetailsModal) {
        personDetailsModal.classList.add('hidden');
    }
});


// Initial generation and graph update
generateFilterTabs();
updateGraph(); // Draw graph with initial state (no filters applied, so no people shown)
