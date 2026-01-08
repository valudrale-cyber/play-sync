// PLAY SYNC — roster filter + small UX helpers
const ROSTERS = {
  "records": [
    "Duki",
    "Nicki Nicole",
    "Bizarrap",
    "Paulo Londra",
    "Wos",
    "La Joaqui",
    "Airbag",
    "Neo Pistea",
    "Callejero Fino",
    "Rei",
    "BM",
    "Taichu",
    "Acru",
    "Doble P",
    "Stiffy",
    "AgusFortnite2008",
    "Lara91k",
    "Cazzu",
    "Zell",
    "Six Sex",
    "Tan Bionica",
    "No Te Va A Gustar",
    "DJ Alex",
    "Ponte Perro",
    "Margarita",
    "Evlay",
    "Cigaro",
    "CNO",
    "Mundialista Crew",
    "Sin Miedo",
    "Marlku",
    "Danilo Montana",
    "Tresseisnueve",
    "Ramma",
    "Ronpe 99",
    "Knak",
    "Frozouda",
    "Turrobaby",
    "Aqua VS",
    "Veeyam",
    "R Jota",
    "El Zarpado",
    "Kleo",
    "Kiddo",
    "Rels B",
    "Delaossa",
    "Reality",
    "Selecta",
    "Mushkaa",
    "El Bugg",
    "Abhir",
    "Diegote",
    "Shakedablock",
    "Razz",
    "Grecas",
    "Jordy Medina",
    "Chzter",
    "Luno",
    "La Receta",
    "Mar Lucas",
    "Malo",
    "Billy Manhattan",
    "Sultan",
    "008Racca",
    "Antonio Algo",
    "Brychtta",
    "Batto90",
    "Molok0",
    "Rozas (AR)",
    "Ilan Amores",
    "Sacrum",
    "Florniccol",
    "Catu",
    "Lilux04",
    "Gigi Lepio",
    "Dileo",
    "Supermerk2",
    "MC Caco",
    "Kun El Principe",
    "Santi Cairo",
    "Yesan",
    "Ixkan",
    "Tokyo Soundystem",
    "Rena Casini",
    "Lali"
  ],
  "publishing": [
    "Nicki Nicole",
    "Bizarrap",
    "Milo J",
    "Santi Alvarado",
    "Kiddo",
    "Rei",
    "BM",
    "Acru",
    "Delaossa",
    "Abhir",
    "Hathi",
    "Yami Safdie",
    "Halpe",
    "Taichu",
    "Barry B",
    "Axe Follin",
    "Akim",
    "88",
    "Mecha",
    "Doble P",
    "Foking",
    "DJ Alex",
    "Six Sex",
    "Cocodrilo",
    "Danilo Montana",
    "Gaspiedieyoung",
    "Mar Romero",
    "Bajo West Klan",
    "Stuart Zone",
    "Replik",
    "Cigaro",
    "Agus Ramasso",
    "Nake",
    "Dommo",
    "Meimi",
    "Lula Rosenthal",
    "MKS",
    "Tizishi",
    "El Bugg",
    "Tiano Faviani",
    "Gara Duran",
    "Flacko Loyal",
    "Pierre",
    "Kerse",
    "Tuiste",
    "Kilvertz",
    "Mercaloops",
    "Bigla",
    "Nico Ramirez",
    "Reelian",
    "Julianno Sosa",
    "Rama VCA",
    "Rose",
    "Rifi Soul"
  ]
};

const grid = document.getElementById("roster-grid");
const search = document.getElementById("search");
const resultsMeta = document.getElementById("results-meta");
const clearBtn = document.getElementById("clear-search");

const segButtons = Array.from(document.querySelectorAll(".seg"));
let activeRoster = "records";

function setCounts() {
  document.getElementById("count-records").textContent = "(" + ROSTERS.records.length + ")";
  document.getElementById("count-publishing").textContent = "(" + ROSTERS.publishing.length + ")";
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[m]);
}

function render() {
  const q = normalize(search.value.trim());
  const list = ROSTERS[activeRoster] || [];
  const filtered = q ? list.filter(n => normalize(n).includes(q)) : list;

  grid.innerHTML = "";
  const frag = document.createDocumentFragment();

  filtered.forEach((name) => {
    const el = document.createElement("div");
    el.className = "artist";
    const tag = activeRoster === "records" ? "REC" : "PUB";
    el.innerHTML = '<span class="name">' + escapeHtml(name) + '</span><span class="tag">' + tag + '</span>';
    frag.appendChild(el);
  });

  grid.appendChild(frag);

  const count = filtered.length;
  const total = list.length;
  resultsMeta.textContent = q
    ? (count + " / " + total + ' results for “' + search.value.trim() + '”')
    : (total + " artists");
}

function setActiveRoster(next) {
  activeRoster = next;
  segButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.roster === next));
  render();
}

segButtons.forEach(btn => {
  btn.addEventListener("click", () => setActiveRoster(btn.dataset.roster));
});

search.addEventListener("input", render);
clearBtn.addEventListener("click", () => {
  search.value = "";
  search.focus();
  render();
});

// Keyboard shortcut: Cmd/Ctrl + K to focus search
window.addEventListener("keydown", (e) => {
  const isK = (e.key || "").toLowerCase() === "k";
  if ((e.metaKey || e.ctrlKey) && isK) {
    e.preventDefault();
    search.focus();
  }
});

setCounts();
render();
