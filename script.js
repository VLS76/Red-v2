// script.js

// 1. Data Definitions
// Sample data for 15 people with their associated fields and indicators.
const peopleData = [
    { id: 1, name: "Dr. Ana García", especie: ["Ovina", "Vacuna"], tecnologia: ["Identificación y monitorización", "Ciencia de datos"], lineas: ["Salud animal"], rol: "IP", institucion: "CICYTEX" },
    { id: 2, name: "Dr. Juan Pérez", especie: ["Ovina"], tecnologia: ["Detección y medición"], lineas: ["Optimización de recursos"], rol: "IP", institucion: "CSIC/INIA" },
    { id: 3, name: "Ms. Laura Díaz", especie: ["Caprina"], tecnologia: ["Biosensores"], lineas: ["Comportamiento animal"], rol: "Postdoc", institucion: "CICYTEX" },
    { id: 4, name: "Dr. Carlos Ruiz", especie: ["Porcina"], tecnologia: ["Posicionamiento y navegación"], lineas: ["Monitoreo de emisiones"], rol: "IP", institucion: "IRTA" },
    { id: 5, name: "Mr. Miguel Sanz", especie: ["Avícola"], tecnologia: ["Automatización y robots"], lineas: ["Reproducción y mejora genética"], rol: "Predoc", institucion: "IRTA" },
    { id: 6, name: "Dr. Elena López", especie: ["Cunícula"], tecnologia: ["Analisis de imágenes"], lineas: ["Salud animal"], rol: "IP", institucion: "IUCA" },
    { id: 7, name: "Ms. Sofía Martín", especie: ["Ovina"], tecnologia: ["Ciencia de datos"], lineas: ["Optimización de recursos"], rol: "Técnico", institucion: "NEIKER" },
    { id: 8, name: "Dr. Pablo Gómez", especie: ["Vacuna"], tecnologia: ["Identificación y monitorización"], lineas: ["Comportamiento animal"], rol: "IP", institucion: "UAB" },
    { id: 9, name: "Mr. David Castro", especie: ["Porcina"], tecnologia: ["Detección y medición"], lineas: ["Monitoreo de emisiones"], rol: "Predoc", institucion: "UAB" },
    { id: 10, name: "Dr. Isabel Flores", especie: ["Caprina"], tecnologia: ["Biosensores"], lineas: ["Reproducción y mejora genética"], rol: "IP", institucion: "UCO" },
    { id: 11, name: "Ms. Rosa Vargas", especie: ["Avícola"], tecnologia: ["Posicionamiento y navegación"], lineas: ["Salud animal"], rol: "Postdoc", institucion: "UCO" },
    { id: 12, name: "Dr. Jorge Moreno", especie: ["Cunícula"], tecnologia: ["Automatización y robots"], lineas: ["Optimización de recursos"], rol: "IP", institucion: "UdL/Agrotecnio" },
    { id: 13, name: "Mr. Sergio Gil", especie: ["Ovina"], tecnologia: ["Analisis de imágenes"], lineas: ["Comportamiento animal"], rol: "Técnico", institucion: "UM" },
    { id: 14, name: "Dr. Natalia Ortega", especie: ["Vacuna"], tecnologia: ["Ciencia de datos"], lineas: ["Monitoreo de emisiones"], rol: "IP", institucion: "USAL" },
    { id: 15, name: "Ms. Carmen Herrero", especie: ["Caprina"], tecnologia: ["Identificación y monitorización"], lineas: ["Reproducción y mejora genética"], rol: "Postdoc", institucion: "USAL" }
];

// Definition of fields and their respective indicators in Spanish.
const fields = {
    Especie: ["Ovina", "Caprina", "Vacuna", "Porcina", "Avícola", "Cunícula"],
    Tecnología: ["Identificación y monitorización", "Detección y medición", "Biosensores", "Posicionamiento y navegación", "Automatización y robots", "Analisis de imágenes", "Ciencia de datos"],
    Lineas: ["Salud animal", "Optimización de recursos", "Comportamiento animal", "Monitoreo de emisiones", "Reproducción y mejora genética"],
    Rol: ["IP", "Postdoc", "Predoc", "Técnico", "Asesor científico"],
    Institución: ["CICYTEX", "CSIC/INIA", "IRTA", "IUCA", "NEIKER", "UAB", "UCO", "UdL/Agrotecnio", "UM", "USAL", "USC/Campus Terra", "UPV"]
};

// Map to assign a unique color to each indicator for link visualization.
const indicatorColors = {};
let colorIndex = 0;
// Using D3's built-in categorical color schemes for a good variety of distinct colors.
const d3Colors = d3.schemeCategory10.concat(d3.schemeAccent).concat(d3.schemePaired).concat(d3.schemeDark2).concat(d3.schemeSet1).concat(d3.schemeSet2).concat(d3.schemeSet3);

// Populate the indicatorColors map.
for (const fieldName in fields) {
    fields[fieldName].forEach(indicator => {
        if (!indicatorColors[indicator]) { // Assign color if not already assigned
            indicatorColors[indicator] = d3Colors[colorIndex % d3Colors.length];
            colorIndex++;
        }
    });
}

// UI Element References
const filterPanel = document.getElementById('filter-panel');
const networkSvg = d3.select("#network-svg");
const personDetailsBox = document.getElementById('person-details');
const personNameElem = document.getElementById('person-name');
const personIndicatorsElem = document.getElementById('person-indicators');
const loadingIndicator = document.getElementById('loading-indicator');

let width, height; // Dimensions of the SVG container
let simulation; // D3 force simulation object
let nodesGroup, linksGroup, linkLabelsGroup; // D3 selections for managing graph elements

// 2. Initialize D3 Force Simulation
function initializeSimulation() {
    // Get the current dimensions of the SVG container
    width = networkSvg.node().clientWidth;
    height = networkSvg.node().clientHeight;

    // Set the viewBox attribute for responsiveness
    networkSvg.attr("viewBox", `0 0 ${width} ${height}`);

    // Create the D3 force simulation
    simulation = d3.forceSimulation()
        // Force that simulates links between nodes. 'id' is used to identify source/target nodes.
        // 'distance' and 'strength' control how far apart linked nodes are and how strongly they are pulled together.
        .force("link", d3.forceLink().id(d => d.id).distance(100).strength(0.8))
        // Force that applies a charge (repulsion) between nodes. Negative strength means repulsion.
        .force("charge", d3.forceManyBody().strength(-300))
        // Force that pulls all nodes towards a specified center point.
        .force("center", d3.forceCenter(width / 2, height / 2))
        // Force that prevents nodes from overlapping. 'radius' defines the effective size of nodes for collision detection.
        .force("collide", d3.forceCollide().radius(d => d.radius + 5).iterations(2));

    // Add zoom and pan functionality to the SVG
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4]) // Allow zooming from 10% to 400%
        .on("zoom", (event) => {
            // Apply the zoom transformation to all graph elements (nodes, links, labels)
            nodesGroup.attr("transform", event.transform);
            linksGroup.attr("transform", event.transform);
            linkLabelsGroup.attr("transform", event.transform);
        });

    networkSvg.call(zoom); // Apply the zoom behavior to the SVG

    // Create D3 groups for different elements to manage rendering order and transformations easily.
    // Links are usually rendered first so nodes appear on top.
    linksGroup = networkSvg.append("g").attr("class", "links");
    linkLabelsGroup = networkSvg.append("g").attr("class", "link-labels");
    nodesGroup = networkSvg.append("g").attr("class", "nodes");
}


// 3. UI Generation (Filters)
// Function to dynamically render the filter tabs and checkboxes.
function renderFilters() {
    // Define a set of distinct colors for the tab borders.
    const tabColors = [
        "border-red-400", "border-orange-400", "border-green-400",
        "border-blue-400", "border-purple-400", "border-pink-400",
        "border-indigo-400", "border-teal-400"
    ];
    let colorIdx = 0;

    // Iterate through each field (Especie, Tecnología, etc.)
    for (const fieldName in fields) {
        const fieldIndicators = fields[fieldName];
        const tabColorClass = tabColors[colorIdx % tabColors.length]; // Cycle through defined colors

        // Create the main tab div
        const tabDiv = document.createElement('div');
        tabDiv.className = `mb-4 border-l-4 ${tabColorClass} rounded-md shadow-sm`;

        // Create the tab header (clickable part)
        const tabHeader = document.createElement('div');
        tabHeader.className = 'tab-header bg-gray-50';
        tabHeader.innerHTML = `
            <span>${fieldName}</span>
            <svg class="arrow-icon w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        `;
        tabDiv.appendChild(tabHeader);

        // Create the tab content area (where checkboxes will go)
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'tab-checkbox-group';

        // Add checkboxes for each indicator within the current field
        fieldIndicators.forEach(indicator => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" data-field="${fieldName}" value="${indicator}">
                <span>${indicator}</span>
            `;
            checkboxGroup.appendChild(label);
        });
        tabContent.appendChild(checkboxGroup);
        tabDiv.appendChild(tabContent);
        filterPanel.appendChild(tabDiv); // Add the complete tab to the filter panel

        // Add event listener for collapsing/expanding the tab content
        tabHeader.addEventListener('click', () => {
            tabContent.classList.toggle('active'); // Toggle 'active' class to show/hide content
            tabHeader.querySelector('.arrow-icon').classList.toggle('rotated'); // Rotate arrow icon
        });

        // Add event listener to all checkboxes to trigger visualization update on change
        checkboxGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                showLoading(); // Show loading indicator
                setTimeout(() => { // Add a small delay to allow loading indicator to render
                    updateVisualization(); // Re-render the network graph
                    hideLoading(); // Hide loading indicator
                }, 100);
            });
        });
        colorIdx++; // Move to the next tab color
    }
}

// 4. Filtering Logic
// Function to get all currently selected indicators from the filter checkboxes.
function getSelectedIndicators() {
    const selected = {};
    // Initialize selected object for each field to ensure all fields are present, even if empty.
    for (const fieldName in fields) {
        selected[fieldName] = [];
    }

    // Iterate through all checked checkboxes and populate the 'selected' object.
    document.querySelectorAll('#filter-panel input[type="checkbox"]:checked').forEach(checkbox => {
        const field = checkbox.dataset.field; // Get the field name from data-field attribute
        const value = checkbox.value; // Get the indicator value
        if (selected[field]) {
            selected[field].push(value);
        }
    });
    return selected;
}

// Function to filter people based on the selected indicators.
function filterPeople() {
    const selectedIndicators = getSelectedIndicators();
    // Get fields that have at least one indicator selected.
    const activeFields = Object.keys(selectedIndicators).filter(field => selectedIndicators[field].length > 0);

    if (activeFields.length === 0) {
        return []; // If no filters are selected, return an empty array (no people shown).
    }

    // Filter the main peopleData array. A person is included if they match ANY selected indicator
    // in ANY active field.
    return peopleData.filter(person => {
        return activeFields.some(field => { // Check if the person matches any of the active fields
            const personFieldValues = Array.isArray(person[field.toLowerCase()]) ? person[field.toLowerCase()] : [person[field.toLowerCase()]];
            // Check if any of the person's values for this field are among the selected indicators.
            return selectedIndicators[field].some(selectedInd => personFieldValues.includes(selectedInd));
        });
    });
}

// Function to calculate nodes and links data for the D3 graph based on filtered people.
function calculateGraphData(filteredPeople) {
    // Create nodes array from filtered people, adding 'radius' and 'isIP' properties for styling.
    const nodes = filteredPeople.map(p => ({ ...p, radius: p.rol === 'IP' ? 20 : 15, isIP: p.rol === 'IP' }));
    const links = [];
    const linkMap = new Map(); // Used to aggregate shared indicators for existing links (to avoid duplicates).

    // Iterate through all unique pairs of people to find common indicators and create links.
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const p1 = nodes[i];
            const p2 = nodes[j];
            const sharedIndicators = [];

            // Compare indicators across all fields for both people.
            for (const fieldName in fields) {
                const p1Values = Array.isArray(p1[fieldName.toLowerCase()]) ? p1[fieldName.toLowerCase()] : [p1[fieldName.toLowerCase()]];
                const p2Values = Array.isArray(p2[fieldName.toLowerCase()]) ? p2[fieldName.toLowerCase()] : [p2[fieldName.toLowerCase()]];

                p1Values.forEach(val1 => {
                    if (p2Values.includes(val1) && !sharedIndicators.includes(val1)) {
                        sharedIndicators.push(val1); // Add unique shared indicators
                    }
                });
            }

            // If common indicators are found, create or update a link.
            if (sharedIndicators.length > 0) {
                // Create a unique key for the link (ensures consistency regardless of p1/p2 order).
                const linkKey = [p1.id, p2.id].sort().join('-');
                if (!linkMap.has(linkKey)) {
                    linkMap.set(linkKey, { source: p1.id, target: p2.id, shared_indicators: [] });
                }
                // Add all shared indicators to the link (Set ensures uniqueness within the link).
                linkMap.get(linkKey).shared_indicators.push(...sharedIndicators);
            }
        }
    }

    // Convert the map values back to an array of links, ensuring unique indicators within each link.
    const uniqueLinks = Array.from(linkMap.values()).map(link => {
        return {
            source: link.source,
            target: link.target,
            shared_indicators: [...new Set(link.shared_indicators)] // Ensure no duplicate indicators for a single link
        };
    });

    return { nodes, links: uniqueLinks };
}


// 5. Update Visualization (D3.js)
// Main function to update the D3 force-directed graph.
function updateVisualization() {
    const filtered = filterPeople(); // Get the current set of people to display
    const { nodes, links } = calculateGraphData(filtered); // Calculate graph nodes and links

    // Update nodes: Use D3's join (enter, update, exit) pattern for efficient updates.
    // Data join: binds data to SVG elements using 'id' as key.
    const nodeSelection = nodesGroup.selectAll(".node")
        .data(nodes, d => d.id);

    nodeSelection.exit().remove(); // Remove elements corresponding to removed data points (Exit selection)

    const nodeEnter = nodeSelection.enter().append("circle") // Create new circle elements for new data points (Enter selection)
        .attr("class", d => `node ${d.isIP ? 'ip' : 'non-ip'}`) // Apply CSS classes based on role
        .attr("r", d => d.radius) // Set radius based on role (IPs larger)
        .on("click", (event, d) => displayPersonDetails(d)) // Click handler to show person details
        .call(d3.drag() // Enable dragging nodes
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodeEnter.append("title").text(d => d.name); // Add a tooltip on hover for node names

    // Update node text labels: Similar join pattern for text elements
    const nodeTextSelection = nodesGroup.selectAll(".node-text")
        .data(nodes, d => d.id);

    nodeTextSelection.exit().remove(); // Remove old text labels

    nodeTextSelection.enter().append("text") // Create new text labels
        .attr("class", "node-text")
        .attr("dy", "0.35em") // Vertical alignment
        .attr("text-anchor", "middle") // Horizontal alignment
        .text(d => d.name)
        .merge(nodeTextSelection); // Merge enter and update selections for consistent styling

    // Update links: Join pattern for line elements
    const linkSelection = linksGroup.selectAll(".link")
        .data(links, d => `${d.source.id}-${d.target.id}`); // Unique key for links

    linkSelection.exit().remove(); // Remove old links

    linkSelection.enter().append("line") // Create new links
        .attr("class", "link")
        .merge(linkSelection) // Merge enter and update selections
        .attr("stroke", d => {
            // Set link color based on the first shared indicator's assigned color.
            // This is a practical compromise for displaying one color per link when multiple indicators are shared.
            return d.shared_indicators.length > 0 ? indicatorColors[d.shared_indicators[0]] : "#999";
        });

    // Update link labels: Join pattern for text elements
    const linkLabelSelection = linkLabelsGroup.selectAll(".link-label")
        .data(links, d => `${d.source.id}-${d.target.id}-label`); // Unique key for link labels

    linkLabelSelection.exit().remove(); // Remove old link labels

    linkLabelSelection.enter().append("text") // Create new link labels
        .attr("class", "link-label")
        .attr("text-anchor", "middle")
        .text(d => d.shared_indicators.join(', ')) // Display all shared indicators as label
        .merge(linkLabelSelection); // Merge enter and update selections


    // Update the simulation with the new nodes and links data.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart(); // Restart the simulation with a high alpha to make changes visible quickly.

    // Define the 'tick' function, which updates element positions on each simulation step.
    simulation.on("tick", () => {
        // Update link positions
        linkSelection
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // Update node circle positions
        nodeSelection
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // Update node text positions (placed below the circle)
        nodeTextSelection
            .attr("x", d => d.x)
            .attr("y", d => d.y + d.radius + 10);

        // Update link label positions (placed slightly above the midpoint of the link)
        linkLabelSelection
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2 - 5);
    });

    // Special "satellite" layout:
    // The force simulation naturally clusters strongly linked nodes.
    // The visual distinction (smaller size, different color) for non-IPs is handled by CSS classes and radius setting.
    // A specific 'satellite' force is not explicitly needed as the clustering behavior of d3.forceLink
    // and d3.forceManyBody, combined with distinct styling, achieves the desired visual effect.
}

// Drag functions for nodes, allowing users to move them around
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart(); // Start simulation if not already running
    d.fx = d.x; // Fix the node's position to its current X
    d.fy = d.y; // Fix the node's position to its current Y
}

function dragged(event, d) {
    d.fx = event.x; // Update fixed X position during drag
    d.fy = event.y; // Update fixed Y position during drag
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0); // Stop simulation if no longer dragging
    d.fx = null; // Release the fixed X position
    d.fy = null; // Release the fixed Y position (node will move according to forces again)
}

// 6. Person Details Box
// Function to display all indicators of a clicked person in the details box.
function displayPersonDetails(person) {
    personDetailsBox.classList.remove('hidden'); // Show the details box
    personNameElem.textContent = person.name; // Set the person's name
    personIndicatorsElem.innerHTML = ''; // Clear any previously displayed indicators

    const allIndicators = {};
    // Iterate through all fields to gather all indicators for the clicked person.
    for (const fieldName in fields) {
        const key = fieldName.toLowerCase(); // Get the lowercase key for data access
        if (person[key]) {
            // Ensure the value is an array (handle single string values as well)
            const values = Array.isArray(person[key]) ? person[key] : [person[key]];
            values.forEach(val => {
                if (!allIndicators[fieldName]) {
                    allIndicators[fieldName] = [];
                }
                allIndicators[fieldName].push(val); // Add indicator to the appropriate field
            });
        }
    }

    // Populate the unordered list with the person's indicators.
    for (const fieldName in allIndicators) {
        if (allIndicators[fieldName].length > 0) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${fieldName}:</strong> ${allIndicators[fieldName].join(', ')}`;
            personIndicatorsElem.appendChild(li);
        }
    }
}

// Loading indicator functions
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Initial setup when the window has fully loaded
window.onload = function() {
    initializeSimulation(); // Set up D3 simulation
    renderFilters(); // Render the filter UI
    updateVisualization(); // Initial call to render an empty or default graph (nothing selected by default)
};

// Event listener for window resize to adjust SVG dimensions and recenter the simulation
window.addEventListener('resize', () => {
    width = networkSvg.node().clientWidth;
    height = networkSvg.node().clientHeight;
    networkSvg.attr("viewBox", `0 0 ${width} ${height}`); // Adjust SVG viewBox
    simulation.force("center", d3.forceCenter(width / 2, height / 2)); // Recenter the force simulation
    simulation.alpha(1).restart(); // Restart simulation to apply new center
});
