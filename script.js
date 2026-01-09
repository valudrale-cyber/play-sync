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



/* =========================
   TRACKS (trial) — filters
   Requires: ./assets/PLAY_SYNC_trial_tracks.json
   ========================= */

const TRACKS_FILTER_KEYS = [
  "usage","mood","energy","durationBucket","genre","rights","clearance",
  "vocals","language","tempo","structure","collection","soundsLike"
];

const tracksState = Object.fromEntries(TRACKS_FILTER_KEYS.map(k => [k, new Set()]));
tracksState.q = "";

let ALL_TRACKS = [];

function tNormalize(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function tEscapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[m]);
}

function buildTrackChips(tracks){
  // Build value->count maps for each filter key
  TRACKS_FILTER_KEYS.forEach((key) => {
    const container = document.getElementById("tf-" + key);
    if (!container) return;

    const counts = new Map();
    tracks.forEach((t) => {
      const v = t[key];
      if (!v) return;
      counts.set(v, (counts.get(v) || 0) + 1);
    });

    const items = Array.from(counts.entries())
      .sort((a,b) => b[1] - a[1])
      .map(([value,count]) => ({ value, count }));

    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    items.forEach(({value,count}) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "tchip";
      chip.dataset.on = "false";
      chip.dataset.key = key;
      chip.dataset.value = value;
      chip.innerHTML = `<span>${tEscapeHtml(value)}</span> <span class="n">${count}</span>`;

      chip.addEventListener("click", () => {
        const set = tracksState[key];
        if (set.has(value)){
          set.delete(value);
          chip.dataset.on = "false";
        } else {
          set.add(value);
          chip.dataset.on = "true";
        }
        renderTracks();
      });

      frag.appendChild(chip);
    });

    container.appendChild(frag);
  });
}

function matchSet(val, set){
  return !set || set.size === 0 || set.has(val);
}

function filterTracks(tracks){
  const q = tNormalize(tracksState.q.trim());
  return tracks.filter((t) => {
    if (q){
      const hay = tNormalize(`${t.title} ${t.artist} ${t.album} ${(t.tags||[]).join(" ")}`);
      if (!hay.includes(q)) return false;
    }

    return (
      matchSet(t.usage, tracksState.usage) &&
      matchSet(t.mood, tracksState.mood) &&
      matchSet(t.energy, tracksState.energy) &&
      matchSet(t.durationBucket, tracksState.durationBucket) &&
      matchSet(t.genre, tracksState.genre) &&
      matchSet(t.rights, tracksState.rights) &&
      matchSet(t.clearance, tracksState.clearance) &&
      matchSet(t.vocals, tracksState.vocals) &&
      matchSet(t.language, tracksState.language) &&
      matchSet(t.tempo, tracksState.tempo) &&
      matchSet(t.structure, tracksState.structure) &&
      matchSet(t.collection, tracksState.collection) &&
      matchSet(t.soundsLike, tracksState.soundsLike)
    );
  });
}

function sortTracks(list, mode){
  const copy = [...list];
  const by = (a,b) => (a>b ? 1 : a<b ? -1 : 0);

  if (mode === "artist"){
    copy.sort((x,y) => by(tNormalize(x.artist), tNormalize(y.artist)));
  } else if (mode === "title"){
    copy.sort((x,y) => by(tNormalize(x.title), tNormalize(y.title)));
  } else if (mode === "mood"){
    copy.sort((x,y) => by(tNormalize(x.mood), tNormalize(y.mood)));
  } else if (mode === "usage"){
    copy.sort((x,y) => by(tNormalize(x.usage), tNormalize(y.usage)));
  } else {
    // newest (YYYY-MM-DD)
    copy.sort((x,y) => by((y.releaseDate||""), (x.releaseDate||"")));
  }
  return copy;
}

function tpill(text){
  if (!text) return "";
  return `<span class="tpill">${tEscapeHtml(text)}</span>`;
}

function renderTrackCard(t){
  const rights = t.rights || "";
  const clearance = t.clearance || "";
  const date = t.releaseDate || "";

  const el = document.createElement("article");
  el.className = "track-card";
  el.innerHTML = `
    <div class="track-top">
      <div>
        <div class="track-title">${tEscapeHtml(t.title || "Untitled")}</div>
        <div class="track-artist">${tEscapeHtml(t.artist || "Unknown artist")}${t.album ? " · " + tEscapeHtml(t.album) : ""}</div>
      </div>
      <div class="track-badges">
        <div class="tbadge">${tEscapeHtml(rights)}</div>
        <div class="tbadge">${tEscapeHtml(clearance)}</div>
      </div>
    </div>

    <div class="track-meta">
      ${tpill(t.genre)}
      ${tpill(t.usage)}
      ${tpill(t.mood)}
      ${tpill("Energy: " + (t.energy || "-"))}
      ${tpill("Dur: " + (t.durationBucket || "-"))}
      ${tpill(t.language)}
      ${tpill(t.tempo)}
    </div>

    <div class="track-bottom">
      <div class="track-small">
        <div><strong>Structure:</strong> ${tEscapeHtml(t.structure || "-")}</div>
        <div><strong>Sounds like:</strong> ${tEscapeHtml(t.soundsLike || "-")} · <strong>Release:</strong> ${tEscapeHtml(date)}</div>
        <div><strong>ISRC:</strong> ${tEscapeHtml(t.isrc || "-")}</div>
      </div>
      <div class="track-actions">
        <button class="btn tiny ghost" type="button" data-shortlist="1">+ Shortlist</button>
      </div>
    </div>
  `;

  el.querySelector('[data-shortlist="1"]')?.addEventListener("click", () => {
    alert(`Shortlisted: ${t.artist} – ${t.title}`);
  });

  return el;
}

function renderTracks(){
  const grid = document.getElementById("tracks-grid");
  const countEl = document.getElementById("tracks-count");
  const sortSel = document.getElementById("tracks-sort");
  if (!grid || !countEl || !sortSel) return;

  const filtered = filterTracks(ALL_TRACKS);
  const sorted = sortTracks(filtered, sortSel.value);

  countEl.textContent = `${sorted.length} results (of ${ALL_TRACKS.length})`;

  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  sorted.forEach((t) => frag.appendChild(renderTrackCard(t)));
  grid.appendChild(frag);
}

async function initTracks(){
  const search = document.getElementById("tracks-search");
  const clear = document.getElementById("tracks-clear");
  const sortSel = document.getElementById("tracks-sort");

  if (!search || !clear || !sortSel) return;

  try{
    const res = await fetch("./PLAY_SYNC_trial_tracks.json");
    if (!res.ok) throw new Error("Failed to load tracks JSON");
    const data = await res.json();
    ALL_TRACKS = (data && data.tracks) ? data.tracks : [];

    buildTrackChips(ALL_TRACKS);

    search.addEventListener("input", () => {
      tracksState.q = search.value || "";
      renderTracks();
    });

    clear.addEventListener("click", () => {
      tracksState.q = "";
      search.value = "";
      TRACKS_FILTER_KEYS.forEach(k => tracksState[k].clear());
      document.querySelectorAll(".tchip").forEach(ch => ch.dataset.on = "false");
      renderTracks();
    });

    sortSel.addEventListener("change", renderTracks);

    renderTracks();
  } catch (e){
    const countEl = document.getElementById("tracks-count");
    if (countEl) countEl.textContent = "Tracks failed to load (check JSON path).";
    console.error(e);
  }
}

// Boot after roster init
initTracks();
