document.addEventListener('DOMContentLoaded', function () {

    // --- 1. DATOS Y CONFIGURACIÓN ---

    // Definición de los campos, sus indicadores y colores asociados
    const filterConfig = {
        especie: {
            label: 'Especie',
            color: '#4CAF50',
            indicators: ['Ovina', 'Caprina', 'Vacuna', 'Porcina', 'Avícola', 'Cunícula']
        },
        tecnologia: {
            label: 'Tecnología',
            color: '#2196F3',
            indicators: ['Identificación y monitorización', 'Detección y medición', 'Biosensores', 'Posicionamiento y navegación', 'Automatización y robots', 'Análisis de imágenes', 'Ciencia de datos']
        },
        lineas: {
            label: 'Líneas de Estudio',
            color: '#FFC107',
            indicators: ['Salud animal', 'Optimización de recursos', 'Comportamiento animal', 'Monitoreo de emisiones', 'Reproducción y mejora genética']
        },
        rol: {
            label: 'Rol',
            color: '#9C27B0',
            indicators: ['IP', 'Postdoc', 'Predoc', 'Técnico', 'Asesor científico']
        },
        institucion: {
            label: 'Institución',
            color: '#E91E63',
            indicators: ['CICYTEX', 'CSIC/INIA', 'IRTA', 'IUCA', 'NEIKER', 'UAB', 'UCO', 'UdL/Agrotecnio', 'UM', 'USAL', 'USC/Campus Terra', 'UPV']
        }
    };

    // Datos de ejemplo con 15 personas
    const personas = [
        { id: 1, nombre: 'Ana García', rol: 'IP', institucion: 'CSIC/INIA', especie: ['Ovina', 'Caprina'], tecnologia: ['Identificación y monitorización', 'Ciencia de datos'], lineas: ['Salud animal'] },
        { id: 2, nombre: 'Luisa Fernández', rol: 'Postdoc', institucion: 'CSIC/INIA', especie: ['Ovina'], tecnologia: ['Biosensores'], lineas: ['Salud animal'] },
        { id: 3, nombre: 'Carlos Ruiz', rol: 'Predoc', institucion: 'CSIC/INIA', especie: ['Caprina'], tecnologia: ['Identificación y monitorización'], lineas: ['Reproducción y mejora genética'] },
        { id: 4, nombre: 'Beatriz Torres', rol: 'IP', institucion: 'IRTA', especie: ['Porcina', 'Avícola'], tecnologia: ['Automatización y robots', 'Análisis de imágenes'], lineas: ['Comportamiento animal'] },
        { id: 5, nombre: 'David Jiménez', rol: 'Técnico', institucion: 'IRTA', especie: ['Porcina'], tecnologia: ['Automatización y robots'], lineas: ['Optimización de recursos'] },
        { id: 6, nombre: 'Elena Moreno', rol: 'IP', institucion: 'UCO', especie: ['Vacuna'], tecnologia: ['Posicionamiento y navegación', 'Ciencia de datos'], lineas: ['Optimización de recursos'] },
        { id: 7, nombre: 'Francisco Díaz', rol: 'Postdoc', institucion: 'UCO', especie: ['Vacuna'], tecnologia: ['Ciencia de datos'], lineas: ['Comportamiento animal'] },
        { id: 8, nombre: 'Gloria Navarro', rol: 'Predoc', institucion: 'NEIKER', especie: ['Ovina', 'Cunícula'], tecnologia: ['Reproducción y mejora genética'], lineas: ['Salud animal'] },
        { id: 9, nombre: 'Hugo Alonso', rol: 'IP', institucion: 'UdL/Agrotecnio', especie: ['Vacuna', 'Porcina'], tecnologia: ['Análisis de imágenes'], lineas: ['Monitoreo de emisiones'] },
        { id: 10, nombre: 'Irene Serrano', rol: 'Técnico', institucion: 'UPV', especie: ['Cunícula'], tecnologia: ['Automatización y robots'], lineas: ['Optimización de recursos'] },
        { id: 11, nombre: 'Javier Pascual', rol: 'Postdoc', institucion: 'CSIC/INIA', especie: ['Caprina'], tecnologia: ['Biosensores'], lineas: ['Salud animal'] },
        { id: 12, nombre: 'Laura Romero', rol: 'Asesor científico', institucion: 'IRTA', especie: ['Avícola'], tecnologia: ['Ciencia de datos'], lineas: ['Comportamiento animal'] },
        { id: 13, nombre: 'Miguel Ángel Soler', rol: 'IP', institucion: 'USAL', especie: ['Vacuna'], tecnologia: ['Identificación y monitorización'], lineas: ['Reproducción y mejora genética'] },
        { id: 14, nombre: 'Nerea Vidal', rol: 'Predoc', institucion: 'USAL', especie: ['Vacuna'], tecnologia: ['Posicionamiento y navegación'], lineas: ['Optimización de recursos'] },
        { id: 15, nombre: 'Óscar Martín', rol: 'Técnico', institucion: 'UdL/Agrotecnio', especie: ['Porcina'], tecnologia: ['Análisis de imágenes'], lineas: ['Monitoreo de emisiones'] }
    ];

    // --- 2. CREACIÓN DINÁMICA DE FILTROS ---

    const filtersContainer = document.getElementById('filters-container');
    Object.keys(filterConfig).forEach(key => {
        const config = filterConfig[key];
        const fieldset = document.createElement('fieldset');
        fieldset.className = `filter-group ${key}`;
        
        const legend = document.createElement('legend');
        legend.textContent = config.label;
        fieldset.appendChild(legend);

        config.indicators.forEach(indicator => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = indicator;
            checkbox.dataset.category = key;
            checkbox.addEventListener('change', updateVisualization);
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${indicator}`));
            fieldset.appendChild(label);
        });
        filtersContainer.appendChild(fieldset);
    });


    // --- 3. CONFIGURACIÓN DE LA VISUALIZACIÓN D3.JS ---

    const container = document.getElementById('network-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select("#network-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on('click', () => tooltip.classed('hidden', true)); // Ocultar tooltip al hacer clic en el fondo

    const tooltip = d3.select("#tooltip");

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.rol === 'IP' ? 30 : 20) + 5));

    let link = svg.append("g").attr("class", "links").selectAll("line");
    let node = svg.append("g").attr("class", "nodes").selectAll("g");

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    }

    // --- 4. LÓGICA DE ACTUALIZACIÓN ---

    function updateVisualization() {
        // Obtener filtros seleccionados
        const selectedFilters = Array.from(document.querySelectorAll('#filters-container input:checked'))
            .map(input => ({ value: input.value, category: input.dataset.category }));

        // Filtrar personas: se muestra si coincide con CUALQUIER filtro seleccionado
        let filteredPersonas = personas;
        if (selectedFilters.length > 0) {
            const selectedValues = selectedFilters.map(f => f.value);
            filteredPersonas = personas.filter(p => {
                return p.rol === p.institucion || // Edge case for single values
                       selectedValues.includes(p.rol) ||
                       selectedValues.includes(p.institucion) ||
                       p.especie.some(e => selectedValues.includes(e)) ||
                       p.tecnologia.some(t => selectedValues.includes(t)) ||
                       p.lineas.some(l => selectedValues.includes(l));
            });
        }
        
        // Crear nodos y enlaces para la simulación
        const nodes = filteredPersonas.map(p => ({...p})); // Copia para no mutar datos originales
        const links = createLinks(nodes);

        // Actualizar los nodos en la visualización
        node = node.data(nodes, d => d.id)
            .join(
                enter => {
                    const g = enter.append("g").attr("class", "node");
                    
                    g.append("circle")
                        .attr("r", d => d.rol === 'IP' ? 25 : 15) // IPs más grandes
                        .attr("fill", d => filterConfig.institucion.color) // Color por institución
                        .on("click", (event, d) => {
                            event.stopPropagation(); // Evitar que el clic se propague al SVG
                            showTooltip(event, d);
                        });
                    
                    g.append("text")
                        .text(d => d.nombre);
                    
                    g.call(drag(simulation));
                    return g;
                },
                update => update,
                exit => exit.remove()
            );
        
        // Actualizar enlaces
        link = link.data(links, d => `${d.source.id}-${d.target.id}`)
            .join("line")
            .attr("class", "link")
            .attr("stroke", d => d.color)
            .attr("stroke-opacity", 0.7)
            .attr("stroke-width", 3);


        // Reiniciar la simulación con los nuevos datos
        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.on("tick", ticked);
        simulation.alpha(1).restart();
        
        applySatelliteLayout(nodes);
    }
    
    function createLinks(nodes) {
        const links = [];
        const nodeIds = new Set(nodes.map(n => n.id));

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const personA = nodes[i];
                const personB = nodes[j];

                // Comprobar si ambos nodos están en la vista actual
                if (!nodeIds.has(personA.id) || !nodeIds.has(personB.id)) continue;
                
                let sharedCategory = null;

                // Chequear por institución compartida
                if (personA.institucion === personB.institucion) {
                    sharedCategory = 'institucion';
                }
                // Chequear por otras categorías
                else if (personA.especie.some(e => personB.especie.includes(e))) {
                    sharedCategory = 'especie';
                } else if (personA.tecnologia.some(t => personB.tecnologia.includes(t))) {
                    sharedCategory = 'tecnologia';
                } else if (personA.lineas.some(l => personB.lineas.includes(l))) {
                    sharedCategory = 'lineas';
                }

                if (sharedCategory) {
                    links.push({
                        source: personA.id,
                        target: personB.id,
                        color: filterConfig[sharedCategory].color
                    });
                }
            }
        }
        return links;
    }
    
    // --- 5. FUNCIONALIDADES ADICIONALES ---

    // Lógica para arrastrar nodos
    function drag(simulation) {
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
        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }

    // Lógica para el tooltip
    function showTooltip(event, d) {
        const content = `
            <h3>${d.nombre}</h3>
            <p><strong>Rol:</strong> ${d.rol}</p>
            <p><strong>Institución:</strong> ${d.institucion}</p>
            ${d.especie.length > 0 ? `<p><strong>Especies:</strong></p><ul>${d.especie.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            ${d.tecnologia.length > 0 ? `<p><strong>Tecnologías:</strong></p><ul>${d.tecnologia.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            ${d.lineas.length > 0 ? `<p><strong>Líneas:</strong></p><ul>${d.lineas.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
        `;

        tooltip
            .html(content)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px")
            .classed("hidden", false);
    }
    
    // Lógica para la agrupación satelital
    function applySatelliteLayout(nodes) {
        const institutionGroups = d3.group(nodes, d => d.institucion);
        
        institutionGroups.forEach(group => {
            const ips = group.filter(p => p.rol === 'IP');
            const others = group.filter(p => p.rol !== 'IP');

            if (ips.length > 0 && others.length > 0) {
                const ipCenter = ips[0]; // Usamos el primer IP como centro
                ipCenter.fx = ipCenter.x; // Fijar la posición del IP
                ipCenter.fy = ipCenter.y;

                others.forEach((person, i) => {
                    const angle = (i / others.length) * 2 * Math.PI;
                    const radius = 60; // Distancia del satélite al IP
                    person.fx = ipCenter.x + radius * Math.cos(angle);
                    person.fy = ipCenter.y + radius * Math.sin(angle);
                });
            } else {
                 // Liberar posiciones si la condición no se cumple
                 group.forEach(p => { p.fx = null; p.fy = null; });
            }
        });
    }

    // --- 6. INICIALIZACIÓN ---
    updateVisualization();
});
