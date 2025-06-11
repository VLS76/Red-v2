document.addEventListener('DOMContentLoaded', function () {

    // --- 1. DATOS Y CONFIGURACIÓN ---
    const filterConfig = {
        especie: { label: 'Especie', color: '#28a745', indicators: ['Ovina', 'Caprina', 'Vacuna', 'Porcina', 'Avícola', 'Cunícula'] },
        tecnologia: { label: 'Tecnología', color: '#007bff', indicators: ['Identificación y monitorización', 'Detección y medición', 'Biosensores', 'Posicionamiento y navegación', 'Automatización y robots', 'Análisis de imágenes', 'Ciencia de datos'] },
        lineas: { label: 'Líneas de Estudio', color: '#ffc107', indicators: ['Salud animal', 'Optimización de recursos', 'Comportamiento animal', 'Monitoreo de emisiones', 'Reproducción y mejora genética'] },
        rol: { label: 'Rol', color: '#6f42c1', indicators: ['IP', 'Postdoc', 'Predoc', 'Técnico', 'Asesor científico'] },
        institucion: { label: 'Institución', color: '#dc3545', indicators: ['CICYTEX', 'CSIC/INIA', 'IRTA', 'IUCA', 'NEIKER', 'UAB', 'UCO', 'UdL/Agrotecnio', 'UM', 'USAL', 'USC/Campus Terra', 'UPV'] }
    };

    const personas = [ { id: 1, nombre: 'Ana García', rol: 'IP', institucion: 'CSIC/INIA', especie: ['Ovina', 'Caprina'], tecnologia: ['Identificación y monitorización', 'Ciencia de datos'], lineas: ['Salud animal'] }, { id: 2, nombre: 'Luisa Fernández', rol: 'Postdoc', institucion: 'CSIC/INIA', especie: ['Ovina'], tecnologia: ['Biosensores'], lineas: ['Salud animal'] }, { id: 3, nombre: 'Carlos Ruiz', rol: 'Predoc', institucion: 'CSIC/INIA', especie: ['Caprina'], tecnologia: ['Ciencia de datos'], lineas: ['Reproducción y mejora genética'] }, { id: 4, nombre: 'Beatriz Torres', rol: 'IP', institucion: 'IRTA', especie: ['Porcina', 'Avícola'], tecnologia: ['Automatización y robots', 'Análisis de imágenes'], lineas: ['Comportamiento animal'] }, { id: 5, nombre: 'David Jiménez', rol: 'Técnico', institucion: 'IRTA', especie: ['Porcina'], tecnologia: ['Automatización y robots'], lineas: ['Optimización de recursos'] }, { id: 6, nombre: 'Elena Moreno', rol: 'IP', institucion: 'UCO', especie: ['Vacuna'], tecnologia: ['Posicionamiento y navegación', 'Ciencia de datos'], lineas: ['Optimización de recursos'] }, { id: 7, nombre: 'Francisco Díaz', rol: 'Postdoc', institucion: 'UCO', especie: ['Vacuna'], tecnologia: ['Ciencia de datos'], lineas: ['Comportamiento animal'] }, { id: 8, nombre: 'Gloria Navarro', rol: 'Predoc', institucion: 'NEIKER', especie: ['Ovina', 'Cunícula'], tecnologia: ['Reproducción y mejora genética'], lineas: ['Salud animal'] }, { id: 9, nombre: 'Hugo Alonso', rol: 'IP', institucion: 'UdL/Agrotecnio', especie: ['Vacuna', 'Porcina'], tecnologia: ['Análisis de imágenes'], lineas: ['Monitoreo de emisiones'] }, { id: 10, nombre: 'Irene Serrano', rol: 'Técnico', institucion: 'UPV', especie: ['Cunícula'], tecnologia: ['Automatización y robots'], lineas: ['Optimización de recursos'] }, { id: 11, nombre: 'Javier Pascual', rol: 'Postdoc', institucion: 'IRTA', especie: ['Avícola'], tecnologia: ['Ciencia de datos'], lineas: ['Comportamiento animal'] }, { id: 12, nombre: 'Laura Romero', rol: 'Asesor científico', institucion: 'USAL', especie: ['Ovina'], tecnologia: ['Salud animal'], lineas: ['Salud animal'] }, { id: 13, nombre: 'Miguel Ángel Soler', rol: 'IP', institucion: 'USAL', especie: ['Vacuna'], tecnologia: ['Identificación y monitorización'], lineas: ['Reproducción y mejora genética'] }, { id: 14, nombre: 'Nerea Vidal', rol: 'Predoc', institucion: 'USAL', especie: ['Vacuna'], tecnologia: ['Posicionamiento y navegación'], lineas: ['Optimización de recursos'] }, { id: 15, nombre: 'Óscar Martín', rol: 'Técnico', institucion: 'UdL/Agrotecnio', especie: ['Porcina'], tecnologia: ['Análisis de imágenes'], lineas: ['Monitoreo de emisiones'] } ];

    // --- 2. CREACIÓN DINÁMICA DE FILTROS ---
    const filtersContainer = document.getElementById('filters-container');
    Object.keys(filterConfig).forEach(key => {
        const config = filterConfig[key];
        // FIX 1: Usar <details> para crear menús desplegables
        const details = document.createElement('details');
        details.className = `filter-group ${key}`;
        const summary = document.createElement('summary');
        summary.textContent = config.label;
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'filter-options';

        config.indicators.forEach(indicator => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = indicator;
            checkbox.addEventListener('change', updateVisualization);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${indicator}`));
            optionsDiv.appendChild(label);
        });
        details.appendChild(summary);
        details.appendChild(optionsDiv);
        filtersContainer.appendChild(details);
    });

    // --- 3. CONFIGURACIÓN DE LA VISUALIZACIÓN D3.JS ---
    const container = document.getElementById('network-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    const tooltip = d3.select("#tooltip");

    // FIX 4: Configuración del comportamiento de zoom y paneo
    const zoom = d3.zoom()
        .scaleExtent([0.2, 7]) // Límites de zoom
        .on("zoom", zoomed);

    const svg = d3.select("#network-container").append("svg")
        .attr("width", width).attr("height", height)
        .call(zoom); // Aplicar el comportamiento de zoom al SVG

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(100).strength(0.7))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.rol === 'IP' ? 25 : 18) + 5));
    
    // Contenedor para todo el grafo (enlaces y nodos) para que el zoom funcione correctamente
    const graphContainer = svg.append("g");
    const linkGroup = graphContainer.append("g").attr("class", "links");
    const nodeGroup = graphContainer.append("g").attr("class", "nodes");
    
    // FIX 4: Función que se ejecuta al hacer zoom/pan
    function zoomed(event) {
        graphContainer.attr("transform", event.transform);
    }
    
    // --- 4. LÓGICA PRINCIPAL DE ACTUALIZACIÓN ---
    function updateVisualization() {
        const selectedIndicators = Array.from(document.querySelectorAll('#filters-container input:checked')).map(i => i.value);
        const filteredPersonas = selectedIndicators.length === 0 ? personas : personas.filter(p => {
            const personData = [p.rol, p.institucion, ...p.especie, ...p.tecnologia, ...p.lineas];
            return personData.some(item => selectedIndicators.includes(item));
        });

        const nodes = filteredPersonas.map(p => ({ ...p }));
        const links = createLinks(nodes);

        nodeGroup.selectAll(".node").data(nodes, d => d.id).join(
            enter => {
                const g = enter.append("g").attr("class", "node");
                g.append("circle")
                    .attr("r", d => d.rol === 'IP' ? 25 : 18)
                    // FIX 2: El color del nodo se basa en el ROL
                    .attr("fill", d => filterConfig.rol.color)
                    .on("click", (event, d) => { event.stopPropagation(); showTooltip(event, d); });
                g.append("text").text(d => d.nombre);
                g.call(drag(simulation));
                return g;
            }
        );

        linkGroup.selectAll("line").data(links, d => `${d.source.id}-${d.target.id}`).join("line").attr("class", "link").attr("stroke", d => d.color);

        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
        applySatelliteLayout(nodes);
    }

    function createLinks(nodes) {
        const links = [];
        for (let i = 0; i < nodes.length; i++) { for (let j = i + 1; j < nodes.length; j++) {
            const p1 = nodes[i]; const p2 = nodes[j];
            let sharedCategoryKey = null;
            if (p1.especie.some(e => p2.especie.includes(e))) sharedCategoryKey = 'especie';
            else if (p1.tecnologia.some(t => p2.tecnologia.includes(t))) sharedCategoryKey = 'tecnologia';
            else if (p1.lineas.some(l => p2.lineas.includes(l))) sharedCategoryKey = 'lineas';
            if (sharedCategoryKey) { links.push({ source: p1.id, target: p2.id, color: filterConfig[sharedCategoryKey].color });}
        }}
        return links;
    }

    function ticked() {
        linkGroup.selectAll("line")
            .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        
        nodeGroup.selectAll(".node").attr("transform", d => {
            // FIX 3: Mantener los nodos dentro de los límites de la pantalla
            const radius = d.rol === 'IP' ? 25 : 18;
            d.x = Math.max(radius, Math.min(width - radius, d.x));
            d.y = Math.max(radius, Math.min(height - radius, d.y));
            return `translate(${d.x},${d.y})`;
        });
    }

    // --- 5. FUNCIONES AUXILIARES (DRAG, TOOLTIP, SATÉLITES) ---
    function drag(simulation) {
        function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
        function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
        function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); if (!d.isSatellite) { d.fx = null; d.fy = null; } }
        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }

    function showTooltip(event, d) {
        // Obtenemos la transformación actual del zoom para posicionar el tooltip correctamente
        const currentTransform = d3.zoomTransform(svg.node());
        const x = currentTransform.applyX(d.x);
        const y = currentTransform.applyY(d.y);

        const content = `<h3>${d.nombre}</h3> <p><strong>Rol:</strong> ${d.rol}</p> <p><strong>Institución:</strong> ${d.institucion}</p> ${d.especie.length ? `<p><strong>Especies:</strong></p><ul>${d.especie.map(i => `<li>${i}</li>`).join('')}</ul>` : ''} ${d.tecnologia.length ? `<p><strong>Tecnologías:</strong></p><ul>${d.tecnologia.map(i => `<li>${i}</li>`).join('')}</ul>` : ''} ${d.lineas.length ? `<p><strong>Líneas:</strong></p><ul>${d.lineas.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}`;
        tooltip.html(content).style("display", "block").style("left", `${x + 15}px`).style("top", `${y + 15}px`);
    }

    function applySatelliteLayout(nodes) {
        nodes.forEach(n => { n.fx = null; n.fy = null; n.isSatellite = false; });
        const institutionGroups = d3.group(nodes, d => d.institucion);
        institutionGroups.forEach(group => {
            const ips = group.filter(p => p.rol === 'IP');
            const others = group.filter(p => p.rol !== 'IP');
            if (ips.length > 0 && others.length > 0) {
                const ipCenter = ips[0];
                others.forEach((person, i) => {
                    const angle = (i / others.length) * 2 * Math.PI;
                    const radius = 80;
                    person.fx = ipCenter.x + radius * Math.cos(angle);
                    person.fy = ipCenter.y + radius * Math.sin(angle);
                    person.isSatellite = true;
                });
            }
        });
    }

    // --- 6. INICIALIZACIÓN ---
    updateVisualization();
});