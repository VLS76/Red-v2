// script.js
const fields = {
  Especie: ["Ovina", "Caprina", "Vacuna", "Porcina", "Avícola", "Cunícula"],
  Tecnologia: ["Identificación y monitorización", "Detección y medición", "Biosensores", "Posicionamiento y navegación", "Automatización y robots", "Analisis de imágenes", "Ciencia de datos"],
  Lineas: ["Salud animal", "Optimización de recursos", "Comportamiento animal", "Monitoreo de emisiones", "Reproducción y mejora genética"],
  Rol: ["IP", "Postdoc", "Predoc", "Técnico", "Asesor científico"],
  Institucion: ["CICYTEX", "CSIC/INIA", "IRTA", "IUCA", "NEIKER", "UAB", "UCO", "UdL/Agrotecnio", "UM", "USAL", "USC/Campus Terra", "UPV"]
};

const people = [
  { id: 1, label: "Ana", fields: { Especie: ["Ovina"], Tecnologia: ["Biosensores"], Lineas: ["Salud animal"], Rol: "IP", Institucion: "IRTA" } },
  { id: 2, label: "Luis", fields: { Especie: ["Caprina"], Tecnologia: ["Analisis de imágenes"], Lineas: ["Reproducción y mejora genética"], Rol: "Postdoc", Institucion: "IRTA" } },
  { id: 3, label: "Maria", fields: { Especie: ["Porcina"], Tecnologia: ["Ciencia de datos"], Lineas: ["Comportamiento animal"], Rol: "IP", Institucion: "CSIC/INIA" } },
  { id: 4, label: "Jose", fields: { Especie: ["Vacuna"], Tecnologia: ["Automatización y robots"], Lineas: ["Salud animal"], Rol: "Técnico", Institucion: "CSIC/INIA" } },
  { id: 5, label: "Elena", fields: { Especie: ["Avícola"], Tecnologia: ["Biosensores"], Lineas: ["Salud animal"], Rol: "Predoc", Institucion: "UAB" } },
  { id: 6, label: "Carlos", fields: { Especie: ["Cunícula"], Tecnologia: ["Detección y medición"], Lineas: ["Optimización de recursos"], Rol: "IP", Institucion: "UPV" } },
  { id: 7, label: "Lucia", fields: { Especie: ["Vacuna"], Tecnologia: ["Ciencia de datos"], Lineas: ["Reproducción y mejora genética"], Rol: "Postdoc", Institucion: "UPV" } },
  { id: 8, label: "Pedro", fields: { Especie: ["Porcina"], Tecnologia: ["Identificación y monitorización"], Lineas: ["Monitoreo de emisiones"], Rol: "Asesor científico", Institucion: "NEIKER" } },
  { id: 9, label: "Nuria", fields: { Especie: ["Ovina"], Tecnologia: ["Analisis de imágenes"], Lineas: ["Comportamiento animal"], Rol: "IP", Institucion: "UCO" } },
  { id: 10, label: "Tomas", fields: { Especie: ["Avícola"], Tecnologia: ["Posicionamiento y navegación"], Lineas: ["Optimización de recursos"], Rol: "Técnico", Institucion: "UCO" } },
  { id: 11, label: "Sara", fields: { Especie: ["Caprina"], Tecnologia: ["Biosensores"], Lineas: ["Salud animal"], Rol: "IP", Institucion: "USC/Campus Terra" } },
  { id: 12, label: "Raul", fields: { Especie: ["Ovina"], Tecnologia: ["Detección y medición"], Lineas: ["Comportamiento animal"], Rol: "Predoc", Institucion: "USC/Campus Terra" } },
  { id: 13, label: "Isabel", fields: { Especie: ["Vacuna"], Tecnologia: ["Ciencia de datos"], Lineas: ["Salud animal"], Rol: "IP", Institucion: "CSIC/INIA" } },
  { id: 14, label: "Miguel", fields: { Especie: ["Cunícula"], Tecnologia: ["Automatización y robots"], Lineas: ["Monitoreo de emisiones"], Rol: "Técnico", Institucion: "IUCA" } },
  { id: 15, label: "Clara", fields: { Especie: ["Porcina"], Tecnologia: ["Analisis de imágenes"], Lineas: ["Reproducción y mejora genética"], Rol: "Postdoc", Institucion: "UM" } }
];

const selected = {};
Object.keys(fields).forEach(field => selected[field] = new Set());

function createFilters() {
  const filters = document.getElementById('filters');
  Object.entries(fields).forEach(([field, indicators]) => {
    const details = document.createElement('details');
    details.classList.add('field-tab', `field-${field}`);

    const summary = document.createElement('summary');
    summary.textContent = field;
    details.appendChild(summary);

    indicators.forEach(ind => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = ind;
      input.addEventListener('change', () => {
        if (input.checked) selected[field].add(ind);
        else selected[field].delete(ind);
        renderNetwork();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(ind));
      details.appendChild(label);
      details.appendChild(document.createElement('br'));
    });
    filters.appendChild(details);
  });
}

function renderNetwork() {
  const matches = people.filter(person => {
    return Object.entries(selected).some(([field, values]) => {
      if (!values.size) return false;
      if (field === 'Rol' || field === 'Institucion') return values.has(person.fields[field]);
      return person.fields[field]?.some(ind => values.has(ind));
    });
  });

  const nodes = matches.map(p => {
    let size = 30;
    let color = '#007bff';
    const sameInst = matches.filter(m => m.fields.Institucion === p.fields.Institucion);
    const isIP = p.fields.Rol === 'IP';
    if (!isIP && sameInst.some(m => m.fields.Rol === 'IP')) {
      size = 20;
      color = '#6c757d';
    }
    return { id: p.id, label: p.label, color, size };
  });

  const edges = [];
  for (let i = 0; i < matches.length; i++) {
    for (let j = i + 1; j < matches.length; j++) {
      const p1 = matches[i];
      const p2 = matches[j];
      let shared = [];
      Object.keys(fields).forEach(f => {
        if (f === 'Rol') return;
        const v1 = p1.fields[f];
        const v2 = p2.fields[f];
        if (!v1 || !v2) return;
        if (Array.isArray(v1)) {
          const common = v1.filter(v => v2.includes(v));
          if (common.length) shared.push(`${f}: ${common.join(', ')}`);
        } else if (v1 === v2) shared.push(`${f}: ${v1}`);
      });
      if (shared.length) edges.push({ from: p1.id, to: p2.id, label: shared.join('\n') });
    }
  }

  const container = document.getElementById('network');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: { shape: 'dot', font: { size: 14 }, scaling: { min: 10, max: 30 } },
    edges: { font: { align: 'middle' }, color: '#999', arrows: 'to' },
    layout: { improvedLayout: true },
    physics: { stabilization: false }
  };
  const network = new vis.Network(container, data, options);

  network.on('click', function (params) {
    if (params.nodes.length) {
      const person = people.find(p => p.id === params.nodes[0]);
      if (!person) return;
      const box = document.getElementById('infoBox');
      box.classList.remove('hidden');
      box.style.top = params.pointer.DOM.y + 'px';
      box.style.left = params.pointer.DOM.x + 'px';
      box.innerHTML = `<strong>${person.label}</strong><br>` +
        Object.entries(person.fields).map(([k, v]) => `<b>${k}:</b> ${Array.isArray(v) ? v.join(', ') : v}`).join('<br>');
    }
  });
}

createFilters();
renderNetwork();
