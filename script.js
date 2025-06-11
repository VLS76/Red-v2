// script.js

const personas = [
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

const campos = {
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

const container = document.getElementById("network");
const filtersContainer = document.getElementById("filters");
const infoBox = document.getElementById("infoBox");

Object.entries(campos).forEach(([campo, opciones]) => {
  const div = document.createElement("div");
  div.className = `campo campo-${campo}`;
  const label = document.createElement("label");
  label.textContent = campo;
  div.appendChild(label);

  opciones.forEach(op => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = op;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected[campo].add(op);
      else selected[campo].delete(op);
      renderNetwork();
    });
    div.appendChild(checkbox);
    div.appendChild(document.createTextNode(op));
    div.appendChild(document.createElement("br"));
  });

  filtersContainer.appendChild(div);
});

function renderNetwork() {
  const nodes = [];
  const edges = [];
  const shown = new Set();

  personas.forEach(persona => {
    let match = false;
    for (let campo in selected) {
      const indicadores = selected[campo];
      if (indicadores.size === 0) continue;
      if (persona.indicadores[campo].some(i => indicadores.has(i))) {
        match = true;
        break;
      }
    }
    if (match || Object.values(selected).every(set => set.size === 0)) {
      shown.add(persona.id);
    }
  });

  const idToNode = {};

  personas.forEach(p => {
    if (!shown.has(p.id)) return;
    let size = 20;
    let shape = "dot";
    let color = "#97C2FC";
    const isIP = p.indicadores.Rol.includes("IP");

    if (isIP) size = 30;

    idToNode[p.id] = {
      id: p.id,
      label: p.nombre,
      size,
      shape,
      color,
    };
    nodes.push(idToNode[p.id]);
  });

  personas.forEach((a, i) => {
    if (!shown.has(a.id)) return;
    for (let j = i + 1; j < personas.length; j++) {
      const b = personas[j];
      if (!shown.has(b.id)) continue;

      let common = [];
      for (let campo in campos) {
        const commonIndicators = a.indicadores[campo].filter(value => b.indicadores[campo].includes(value));
        if (commonIndicators.length > 0) {
          common.push(`${campo}: ${commonIndicators.join(", ")}`);
        }
      }

      if (common.length > 0) {
        edges.push({
          from: a.id,
          to: b.id,
          label: common.join("\n"),
          font: { align: "middle" },
          arrows: "none"
        });
      }
    }
  });

  // Reorganización satelital por IP
  personas.forEach(p => {
    if (!shown.has(p.id)) return;
    const ipInInstitution = personas.find(other =>
      shown.has(other.id) &&
      other.id !== p.id &&
      other.indicadores.Institución[0] === p.indicadores.Institución[0] &&
      other.indicadores.Rol.includes("IP")
    );
    if (ipInInstitution && !p.indicadores.Rol.includes("IP")) {
      edges.push({
        from: ipInInstitution.id,
        to: p.id,
        dashes: true,
        color: { color: "gray" },
        label: "Mismo centro"
      });
    }
  });

  const network = new vis.Network(container, {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  }, {
    interaction: { hover: true },
    physics: { stabilization: false },
  });

  network.on("click", params => {
    const nodeId = params.nodes[0];
    if (nodeId) {
      const persona = personas.find(p => p.id === nodeId);
      if (persona) {
        infoBox.innerHTML = `<h3>${persona.nombre}</h3>` +
          Object.entries(persona.indicadores).map(([k, v]) => `<b>${k}:</b> ${v.join(", ")}<br>`).join("");
        infoBox.classList.remove("hidden");
      }
    } else {
      infoBox.classList.add("hidden");
    }
  });
}

renderNetwork();