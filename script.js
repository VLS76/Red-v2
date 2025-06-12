// Define fields and indicators
const fields = {
    "Especie": ["Ovina", "Caprina", "Vacuna", "Porcina", "Avícola", "Cunícula"],
    "Tecnología": ["Identificación y monitorización", "Detección y medición", "Biosensores", "Posicionamiento y navegación", "Automatización y robots", "Analisis de imágenes", "Ciencia de datos"],
    "Linies": ["Salud animal", "Optimización de recursos", "Comportamiento animal", "Monitoreo de emisiones", "Reproducción y mejora genética"],
    "Rol": ["IP", "Postdoc", "Predoc", "Técnico", "Asesor científico"],
    "Institución": ["CICYTEX", "CSIC/INIA", "IRTA", "IUCA", "NEIKER", "UAB", "UCO", "UdL/Agrotecnio", "UM", "USAL", "USC/Campus Terra", "UPV"]
};

// Define colors for tabs
const colors = {
    "Especie": "red",
    "Tecnología": "blue",
    "Linies": "green",
    "Rol": "orange",
    "Institución": "purple"
};

// Function to create random choice
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to create random subset
function randomSubset(arr, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate 15 people
const people = [];
for (let i = 1; i <= 15; i++) {
    const person = {
        id: i,
        name: `Person ${i}`,
        institucion: randomChoice(fields["Institución"]),
        rol: randomChoice(fields["Rol"]),
        especie: randomSubset(fields["Especie"], 1, 3),
        tecnologia: randomSubset(fields["Tecnología"], 1, 3),
        linies: randomSubset(fields["Linies"], 1, 3)
    };
    people.push(person);
}

// Create tabs
const tabsDiv = document.getElementById("tabs");
for (const field in fields) {
    const details = document.createElement("details");
    details.style.borderColor = colors[field];
    const summary = document.createElement("summary");
    summary.textContent = field;
    details.appendChild(summary);
    const div = document.createElement("div");
    for (const indicator of fields[field]) {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = `${field}_${indicator.replace(/ /g, "_")}`;
        input.value = indicator;
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = indicator;
        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(document.createElement("br"));
    }
    details.appendChild(div);
    tabsDiv.appendChild(details);
}

// Field to property mapping
const fieldToProp = {
    "Especie": "especie",
    "Tecnología": "tecnologia",
    "Linies": "linies",
    "Rol": "rol",
    "Institución": "institucion"
};

// Function to get shared indicators
function getSharedIndicators(p1, p2) {
    const shared = [];
    const especieShared = p1.especie.filter(es => p2.especie.includes(es));
    if (especieShared.length > 0) {
        shared.push(`Especie: ${especieShared.join(", ")}`);
    }
    const tecnologiaShared = p1.tecnologia.filter(tec => p2.tecnologia.includes(tec));
    if (tecnologiaShared.length > 0) {
        shared.push(`Tecnología: ${tecnologiaShared.join(", ")}`);
    }
    const liniesShared = p1.linies.filter(lin => p2.linies.includes(lin));
    if (liniesShared.length > 0) {
        shared.push(`Linies: ${liniesShared.join(", ")}`);
    }
    if (p1.rol === p2.rol) {
        shared.push(`Rol: ${p1.rol}`);
    }
    if (p1.institucion === p2.institucion) {
        shared.push(`Institución: ${p1.institucion}`);
    }
    return shared;
}

// Update network function
function updateNetwork() {
    const selected = {};
    for (const field in fields) {
        selected[field] = [];
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="${field}_"]`);
        checkboxes.forEach(cb => {
            if (cb.checked) {
                selected[field].push(cb.value);
            }
        });
    }

    const filteredPeople = people.filter(person => {
        const anySelection = Object.values(selected).some(arr => arr.length > 0);
        if (!anySelection) return true;
        for (const field in selected) {
            if (selected[field].length > 0) {
                const prop = fieldToProp[field];
                if (prop === "rol" || prop === "institucion") {
                    if (selected[field].includes(person[prop])) return true;
                } else {
                    if (person[prop].some(ind => selected[field].includes(ind))) return true;
                }
            }
        }
        return false;
    });

    const institutions = {};
    filteredPeople.forEach(person => {
        if (!institutions[person.institucion]) {
            institutions[person.institucion] = [];
        }
        institutions[person.institucion].push(person);
    });

    const instList = Object.keys(institutions);
    const xStep = 1000 / (instList.length + 1);
    instList.forEach((inst, index) => {
        const x = (index + 1) * xStep;
        const group = institutions[inst];
        const ips = group.filter(p => p.rol === "IP");
        const nonIps = group.filter(p => p.rol !== "IP");
        if (ips.length > 0) {
            ips.forEach((ip, idx) => {
                ip.x = x + idx * 50;
                ip.y = 0;
            });
            const r = 100;
            const thetaStep = nonIps.length > 0 ? 2 * Math.PI / nonIps.length : 0;
            nonIps.forEach((nip, idx) => {
                const theta = idx * thetaStep;
                nip.x = x + r * Math.cos(theta);
                nip.y = 0 + r * Math.sin(theta);
            });
        } else {
            group.forEach((p, idx) => {
                p.x = x + (idx % 3) * 50;
                p.y = Math.floor(idx / 3) * 50;
            });
        }
    });

    const nodes = filteredPeople.map(person => ({
        id: person.id,
        label: person.name,
        x: person.x,
        y: person.y,
        fixed: true,
        size: person.rol === "IP" ? 30 : 20,
        color: person.rol === "IP" ? "red" : "blue"
    }));

    const edges = [];
    for (let i = 0; i < filteredPeople.length; i++) {
        for (let j = i + 1; j < filteredPeople.length; j++) {
            const p1 = filteredPeople[i];
            const p2 = filteredPeople[j];
            const shared = getSharedIndicators(p1წ

            if (shared.length > 0) {
                edges.push({
                    from: p1.id,
                    to: p2.id,
                    title: shared.join("<br>")
                });
            }
        }
    }

    const container = document.getElementById("network");
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = {
        physics: false,
        nodes: {
            shape: "dot",
            scaling: {
                min: 10,
                max: 30
            },
            font: {
                size: 12,
                face: "arial"
            }
        },
        edges: {
            color: "gray",
            smooth: false
        }
    };
    const network = new vis.Network(container, data, options);

    network.on("click", function(params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const person = filteredPeople.find(p => p.id === nodeId);
            if (person) {
                alert(`Indicators:\nEspecie: ${person.especie.join(", ")}\nTecnología: ${person.tecnologia.join(", ")}\nLinies: ${person.linies.join(", ")}\nRol: ${person.rol}\nInstitución: ${person.institucion}`);
            }
        }
    });
}

// Initial call
updateNetwork();

// Add event listener
tabsDiv.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        updateNetwork();
    }
});