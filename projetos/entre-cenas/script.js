// Entre Cenas: catálogo, coleção pessoal e estatísticas em JavaScript puro.
// Dados pessoais ficam no localStorage; o token do TMDb dura apenas a sessão.
const LIBRARY_KEY = "entre-cenas-library-v1";
const TOKEN_KEY = "entre-cenas-tmdb-token";
const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

// Capas provisórias da seleção de demonstração, servidas pelo TMDb.
const DEMO_POSTERS = {
  "demo-1": "/hhoKhsyJ3hFaxEm5pMdZRiTu2lJ.jpg",
  "demo-2": "/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg",
  "demo-3": "/gfnXixcGC060QcG6JPxN6AMdVsq.jpg",
  "demo-4": "/bNGW8zYA91VqTZfV3jnKHPEKKvB.jpg",
  "demo-5": "/2dSZQGwijlXvMSyuGe0FSgrXnv0.jpg",
  "demo-6": "/y3IhuITELtprMhUd7bccu629rba.jpg",
  "demo-7": "/2msJb27jMeuA101ox4MuTQK4mDa.jpg",
  "demo-8": "/gwLPVYqe1efIxkx6LQT7piZweH2.jpg",
  "demo-9": "/dUPQszWoRSE9FucJTbVp2bwEi9G.jpg",
  "demo-10": "/62SAZfLfzhxJWUFJvfIPMw6QUpE.jpg",
  "demo-11": "/VMy4UGsI2u3f4fALGeCqCdsQBb.jpg",
  "demo-12": "/qfyWFhUhqeNRU9HmCaBDAxVKRZ9.jpg"
};

const DEMO_FILMS = [
  { id: "demo-1", title: "A Viagem de Chihiro", year: 2001, genres: ["Animação", "Fantasia"], overview: "Uma menina entra em um mundo desconhecido e precisa encontrar coragem para voltar para casa." },
  { id: "demo-2", title: "Interestelar", year: 2014, genres: ["Ficção científica", "Drama"], overview: "Uma missão espacial coloca o futuro da humanidade e os laços de uma família na mesma balança." },
  { id: "demo-3", title: "Cidade de Deus", year: 2002, genres: ["Drama", "Crime"], overview: "Duas trajetórias muito diferentes se cruzam em uma comunidade do Rio de Janeiro." },
  { id: "demo-4", title: "Parasita", year: 2019, genres: ["Drama", "Suspense"], overview: "O encontro entre duas famílias revela tensões sociais e consequências inesperadas." },
  { id: "demo-5", title: "Tudo em Todo o Lugar ao Mesmo Tempo", year: 2022, genres: ["Aventura", "Ficção científica"], overview: "Uma mulher atravessa possibilidades improváveis enquanto tenta se reconectar com sua família." },
  { id: "demo-6", title: "O Auto da Compadecida", year: 2000, genres: ["Comédia", "Aventura"], overview: "Dois amigos usam esperteza e imaginação para sobreviver às confusões do sertão." },
  { id: "demo-7", title: "Whiplash", year: 2014, genres: ["Drama", "Música"], overview: "Um jovem baterista enfrenta a pressão de um professor exigente em busca da excelência." },
  { id: "demo-8", title: "Pequena Miss Sunshine", year: 2006, genres: ["Comédia", "Drama"], overview: "Uma família atravessa o país em uma viagem cheia de atritos, afeto e descobertas." },
  { id: "demo-9", title: "Oppenheimer", year: 2023, genres: ["Drama", "História"], overview: "A vida de um cientista muda enquanto seu trabalho transforma o mundo para sempre." },
  { id: "demo-10", title: "Divertida Mente", year: 2015, genres: ["Animação", "Família"], overview: "As emoções de uma menina tentam ajudá-la a lidar com uma grande mudança de vida." },
  { id: "demo-11", title: "Duna: Parte Dois", year: 2024, genres: ["Ficção científica", "Aventura"], overview: "Em um planeta desértico, alianças e escolhas difíceis definem o destino de povos inteiros." },
  { id: "demo-12", title: "Central do Brasil", year: 1998, genres: ["Drama"], overview: "Uma mulher e um menino criam uma ligação inesperada durante uma viagem pelo Brasil." }
].map(film => ({ ...film, poster: TMDB_IMAGE + DEMO_POSTERS[film.id] }));

const GENRE_NAMES = {
  12: "Aventura", 14: "Fantasia", 16: "Animação", 18: "Drama", 27: "Terror",
  28: "Ação", 35: "Comédia", 36: "História", 37: "Faroeste", 53: "Suspense",
  80: "Crime", 99: "Documentário", 878: "Ficção científica", 9648: "Mistério",
  10402: "Música", 10749: "Romance", 10751: "Família", 10752: "Guerra"
};
const POSTER_COLORS = [
  "linear-gradient(155deg, #5c675d, #1d2926 78%)",
  "linear-gradient(150deg, #9b6449, #33251e 78%)",
  "linear-gradient(160deg, #777986, #262630 80%)",
  "linear-gradient(140deg, #716a53, #262a25 76%)",
  "linear-gradient(160deg, #875f5c, #312025 78%)",
  "linear-gradient(150deg, #596f75, #1d2d31 80%)"
];

const $ = selector => document.querySelector(selector);
const catalogGrid = $("#catalog-grid");
const libraryGrid = $("#library-grid");
const detailDialog = $("#detail-dialog");
const settingsDialog = $("#settings-dialog");

// Leitura defensiva: dados do navegador podem ter sido alterados ou corrompidos.
function safePoster(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "image.tmdb.org" ? url.href : null;
  } catch {
    return null;
  }
}

function loadLibrary() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item.id === "string" && typeof item.title === "string" && ["pending", "watched"].includes(item.status))
      .map(item => ({
        id: item.id,
        title: item.title.slice(0, 150),
        year: Number.isInteger(item.year) ? item.year : null,
        genres: Array.isArray(item.genres) ? item.genres.filter(genre => typeof genre === "string").slice(0, 5) : [],
        overview: typeof item.overview === "string" ? item.overview.slice(0, 1000) : "",
        poster: safePoster(item.poster) || (DEMO_POSTERS[item.id] ? TMDB_IMAGE + DEMO_POSTERS[item.id] : null),
        status: item.status,
        rating: Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 ? item.rating : 0,
        watchedAt: typeof item.watchedAt === "string" ? item.watchedAt : "",
        note: typeof item.note === "string" ? item.note.slice(0, 600) : "",
        updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : 0
      }));
  } catch {
    return [];
  }
}

let library = loadLibrary();
let catalog = DEMO_FILMS;
let activeView = "explore";
let libraryFilter = "all";
let selectedFilm = null;
let currentRequest = null;
let toastTimer = null;
let currentMemoryIndex = 0;
const revealTriggersByGrid = new WeakMap();

function revealCards(grid) {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const oldTriggers = revealTriggersByGrid.get(grid) || [];
  oldTriggers.forEach(trigger => trigger.kill());

  const cards = [...grid.querySelectorAll(".film-card")];
  if (!cards.length || grid.closest("[hidden]")) return;

  gsap.set(cards, { autoAlpha: 0, y: 12 });
  const triggers = ScrollTrigger.batch(cards, {
    start: "top 93%",
    once: true,
    interval: 0.08,
    batchMax: 4,
    onEnter: elements => gsap.to(elements, {
      autoAlpha: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.055,
      ease: "power2.out",
      overwrite: true
    })
  });
  revealTriggersByGrid.set(grid, triggers);
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from(".site-header", { autoAlpha: 0, y: -8, duration: 0.3 })
      .from(".hero-art-image", { autoAlpha: 0, scale: 1.03, duration: 0.8 }, "-=0.18")
      .from(".hero-copy .eyebrow", { autoAlpha: 0, y: 8, duration: 0.25 }, "-=0.65")
      .from(".hero-word", { clipPath: "inset(0 100% 0 0)", x: -12, duration: 0.58, stagger: 0.1, ease: "power2.inOut" }, "-=0.28")
      .from(".hero-copy > p:not(.eyebrow), .hero-link", { autoAlpha: 0, y: 8, duration: 0.35, stagger: 0.08 }, "-=0.3")
      .from(".hero-art-frame figcaption", { autoAlpha: 0, y: 6, duration: 0.3 }, "-=0.15");

    gsap.fromTo(".projection-sweep", { xPercent: -120, autoAlpha: 0 }, {
      xPercent: 120, autoAlpha: 0.55, duration: 0.85, ease: "power2.inOut", delay: 0.22,
      onComplete: () => gsap.set(".projection-sweep", { autoAlpha: 0 })
    });

    gsap.from(".overview > div, .overview-note", {
      autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: ".overview", start: "top 88%", once: true }
    });

    gsap.from("#explore-view .section-heading, #explore-view .search-form", {
      autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: "#explore-view", start: "top 82%", once: true }
    });

    gsap.to(".hero-art-image", {
      scale: 1.055,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-art-frame",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.45
      }
    });

    const track = $(".marquee-track");
    const distance = track.scrollWidth / 2;
    if (distance > 0) gsap.to(track, { x: -distance, duration: 68, ease: "none", repeat: -1 });

    const magneticButton = $("[data-magnetic]");
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const moveMagnet = event => {
      const bounds = magneticButton.getBoundingClientRect();
      const x = gsap.utils.clamp(-4, 4, (event.clientX - bounds.left - bounds.width / 2) * 0.08);
      const y = gsap.utils.clamp(-3, 3, (event.clientY - bounds.top - bounds.height / 2) * 0.08);
      gsap.to(magneticButton, { x, y, duration: 0.28, ease: "power2.out", overwrite: true });
    };
    const resetMagnet = () => gsap.to(magneticButton, { x: 0, y: 0, duration: 0.35, ease: "power2.out", overwrite: true });
    magneticButton.addEventListener("pointermove", moveMagnet);
    magneticButton.addEventListener("pointerleave", resetMagnet);
    return () => {
      magneticButton.removeEventListener("pointermove", moveMagnet);
      magneticButton.removeEventListener("pointerleave", resetMagnet);
    };
  });
}

function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

function setToken(value) {
  try {
    if (value) sessionStorage.setItem(TOKEN_KEY, value);
    else sessionStorage.removeItem(TOKEN_KEY);
    return true;
  } catch {
    showToast("Este navegador bloqueou o armazenamento da sessão.");
    return false;
  }
}

function saveLibrary() {
  try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(library)); }
  catch { showToast("Não foi possível salvar sua lista neste navegador."); }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function findFilm(id) {
  return library.find(film => film.id === id) || catalog.find(film => film.id === id);
}

function posterFor(film) {
  const poster = document.createElement("div");
  poster.className = "film-poster";
  const colorIndex = [...film.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % POSTER_COLORS.length;
  poster.style.setProperty("--poster-bg", POSTER_COLORS[colorIndex]);

  const showFallback = () => {
    poster.classList.remove("has-image");
    poster.replaceChildren();
    const top = document.createElement("span");
    top.className = "poster-top";
    top.textContent = "ENTRE CENAS / SELEÇÃO";
    const mark = document.createElement("span");
    mark.className = "poster-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "EC";
    const title = document.createElement("span");
    title.className = "poster-title";
    title.textContent = film.title;
    poster.append(top, mark, title);
  };

  if (film.poster) {
    poster.classList.add("has-image");
    const image = document.createElement("img");
    image.src = film.poster;
    image.alt = ""; // O título aparece ao lado; repetir no alt atrapalharia leitores de tela.
    image.loading = "lazy";
    image.addEventListener("error", showFallback, { once: true });
    poster.append(image);
  } else {
    showFallback();
  }
  return poster;
}

function cardFor(film, inLibrary = false) {
  const card = document.createElement("article");
  card.className = "film-card";
  const coverButton = document.createElement("button");
  coverButton.type = "button";
  coverButton.className = "film-cover-button";
  coverButton.dataset.action = "open";
  coverButton.dataset.id = film.id;
  coverButton.setAttribute("aria-label", `Abrir detalhes de ${film.title}`);
  coverButton.append(posterFor(film));

  const info = document.createElement("div");
  info.className = "card-info";
  const text = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = film.title;
  const meta = document.createElement("p");
  meta.className = "card-meta";
  const description = [film.year, film.genres[0]].filter(Boolean).join(" · ");
  meta.textContent = inLibrary ? `${description} · ${film.status === "watched" ? "Já vi" : "Quero ver"}` : description;
  text.append(title, meta);
  if (inLibrary && film.rating > 0) {
    const rating = document.createElement("div");
    rating.className = "rating-line";
    rating.textContent = "★".repeat(film.rating) + "☆".repeat(5 - film.rating);
    text.append(rating);
  }

  const saved = library.some(item => item.id === film.id);
  const quickButton = document.createElement("button");
  quickButton.type = "button";
  quickButton.className = `quick-add${saved ? " is-saved" : ""}`;
  quickButton.dataset.action = saved ? "open" : "add";
  quickButton.dataset.id = film.id;
  quickButton.textContent = saved ? "✓" : "+";
  quickButton.setAttribute("aria-label", saved ? `Editar ${film.title} na minha lista` : `Adicionar ${film.title} à minha lista`);
  info.append(text, quickButton);
  card.append(coverButton, info);
  return card;
}

function renderOverview() {
  const watched = library.filter(film => film.status === "watched").length;
  $("#overview-total").textContent = String(library.length).padStart(2, "0");
  $("#overview-watched").textContent = String(watched).padStart(2, "0");
  $("#overview-pending").textContent = String(library.length - watched).padStart(2, "0");
}

function renderCatalog() {
  catalogGrid.replaceChildren(...catalog.map(film => cardFor(film)));
  catalogGrid.setAttribute("aria-busy", "false");
  revealCards(catalogGrid);
  $("#catalog-count").textContent = `${catalog.length} ${catalog.length === 1 ? "filme" : "filmes"}`;
  if (catalog.length === 0 && $("#catalog-message").hidden) {
    $("#catalog-message").hidden = false;
    $("#catalog-message").textContent = "Nenhum filme encontrado. Tente outro título.";
  } else if ($("#catalog-message").textContent === "Nenhum filme encontrado. Tente outro título.") {
    $("#catalog-message").hidden = true;
  }
}

function renderCatalogSkeletons() {
  return Array.from({ length: 8 }, () => {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.setAttribute("aria-hidden", "true");

    const poster = document.createElement("div");
    poster.className = "skeleton-poster";
    const title = document.createElement("div");
    title.className = "skeleton-line skeleton-title";
    const meta = document.createElement("div");
    meta.className = "skeleton-line skeleton-meta";
    card.append(poster, title, meta);
    return card;
  });
}

function renderLibrary() {
  const visible = library.filter(film => libraryFilter === "all" || film.status === libraryFilter);
  const sort = $("#sort-select").value;
  visible.sort((a, b) => sort === "title" ? a.title.localeCompare(b.title, "pt-BR") : sort === "rating" ? b.rating - a.rating || b.updatedAt - a.updatedAt : b.updatedAt - a.updatedAt);
  libraryGrid.replaceChildren(...visible.map(film => cardFor(film, true)));
  revealCards(libraryGrid);
  $("#library-message").hidden = visible.length > 0;
  $("#library-message").textContent = library.length === 0
    ? "Sua coleção ainda está vazia. Abra Descobrir e adicione seu primeiro filme."
    : "Nenhum filme nesta categoria. Experimente outro filtro.";
}

function renderMemoryCarousel() {
  const memories = library
    .filter(film => typeof film.note === "string" && film.note.trim())
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const empty = $("#memory-empty");
  const carousel = $("#memory-carousel");

  empty.hidden = memories.length > 0;
  carousel.hidden = memories.length === 0;
  if (!memories.length) return;

  currentMemoryIndex = Math.min(currentMemoryIndex, memories.length - 1);
  const film = memories[currentMemoryIndex];
  $("#memory-note").textContent = `“${film.note.trim()}”`;
  $("#memory-title").textContent = film.title;
  if (film.watchedAt) {
    const [year, month, day] = film.watchedAt.split("-").map(Number);
    const localDate = year && month && day ? new Date(year, month - 1, day) : null;
    $("#memory-date").textContent = localDate
      ? `Assistido em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(localDate)}`
      : "Data não registrada";
  } else {
    $("#memory-date").textContent = "Data não registrada";
  }
  $("#memory-position").textContent = `${currentMemoryIndex + 1} / ${memories.length}`;
  $("#memory-prev").disabled = memories.length < 2;
  $("#memory-next").disabled = memories.length < 2;
}

function renderStats() {
  const watched = library.filter(film => film.status === "watched");
  const rated = watched.filter(film => film.rating > 0);
  const average = rated.length ? (rated.reduce((sum, film) => sum + film.rating, 0) / rated.length).toFixed(1).replace(".", ",") : "—";
  $("#stat-watched").textContent = watched.length;
  $("#stat-pending").textContent = library.length - watched.length;
  $("#stat-average").textContent = average;

  const counts = new Map();
  watched.forEach(film => film.genres.forEach(genre => counts.set(genre, (counts.get(genre) || 0) + 1)));
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const chart = $("#genre-chart");
  chart.replaceChildren();
  if (top.length === 0) {
    const empty = document.createElement("p");
    empty.className = "genre-empty";
    empty.textContent = "Marque filmes como assistidos para conhecer seus gêneros favoritos.";
    chart.append(empty);
  } else {
    const max = top[0][1];
    top.forEach(([genre, count]) => {
      const row = document.createElement("div");
      row.className = "genre-row";
      const name = document.createElement("span");
      name.textContent = genre;
      const track = document.createElement("div");
      track.className = "genre-track";
      const fill = document.createElement("div");
      fill.className = "genre-fill";
      fill.style.width = `${(count / max) * 100}%`;
      track.append(fill);
      const number = document.createElement("span");
      number.textContent = count;
      row.append(name, track, number);
      chart.append(row);
    });
  }
  renderMemoryCarousel();
}

function renderAll() {
  currentMemoryIndex = 0;
  renderOverview();
  renderCatalog();
  renderLibrary();
  renderStats();
}

function switchView(view) {
  if (!["explore", "library", "stats"].includes(view)) return;
  activeView = view;
  document.querySelectorAll(".nav-button").forEach(button => {
    const chosen = button.dataset.view === view;
    button.classList.toggle("is-active", chosen);
    if (chosen) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  ["explore", "library", "stats"].forEach(name => { $(`#${name}-view`).hidden = name !== view; });
  if (view === "library") revealCards(libraryGrid);
  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.fromTo(`#${view}-view .section-heading`, { autoAlpha: 0, y: 15 }, {
      autoAlpha: 1, y: 0, duration: 0.46, ease: "power2.out", overwrite: true
    });
  }
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  $(".section-nav").scrollIntoView({ behavior, block: "start" });
  if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
}

function openDetail(id) {
  const film = findFilm(id);
  if (!film) return;
  selectedFilm = film;
  const saved = library.find(item => item.id === id);
  $("#detail-title").textContent = film.title;
  $("#detail-meta").textContent = [film.year, ...film.genres].filter(Boolean).join(" · ");
  $("#detail-overview").textContent = film.overview || "Sem sinopse disponível para este filme.";
  $("#detail-poster").replaceChildren(posterFor(film));
  $("#detail-id").value = id;
  $("#detail-status").value = saved?.status || "pending";
  $("#detail-rating").value = String(saved?.rating || 0);
  $("#detail-date").value = saved?.watchedAt || "";
  $("#detail-note").value = saved?.note || "";
  updateDetailFields();
  detailDialog.showModal();
}

function updateDetailFields() {
  const watched = $("#detail-status").value === "watched";
  $("#detail-rating").disabled = !watched;
  $("#detail-date").disabled = !watched;
  $("#detail-note").disabled = $("#detail-status").value === "remove";
}

function addToLibrary(id) {
  const film = findFilm(id);
  if (!film || library.some(item => item.id === id)) return;
  library.unshift({ ...film, status: "pending", rating: 0, watchedAt: "", note: "", updatedAt: Date.now() });
  saveLibrary();
  renderAll();
  showToast(`${film.title} entrou na sua lista.`);
}

function normalizeTmdbFilm(item) {
  if (!item || !Number.isInteger(item.id) || !item.title) return null;
  const posterPath = typeof item.poster_path === "string" && /^\/[\w.-]+$/.test(item.poster_path) ? item.poster_path : null;
  return {
    id: `tmdb-${item.id}`,
    title: String(item.title),
    year: /^\d{4}/.test(item.release_date || "") ? Number(item.release_date.slice(0, 4)) : null,
    genres: (item.genre_ids || []).map(id => GENRE_NAMES[id]).filter(Boolean),
    overview: typeof item.overview === "string" ? item.overview : "",
    poster: posterPath ? TMDB_IMAGE + posterPath : null
  };
}

async function loadCatalog(query = "") {
  currentRequest?.abort(); // Uma pesquisa antiga não deve sobrescrever a mais recente.
  const token = getToken();
  const message = $("#catalog-message");
  $("#catalog-heading").textContent = query ? `Resultados para “${query}”` : "Filmes em destaque";
  if (!token) {
    catalog = DEMO_FILMS.filter(film => film.title.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
    $("#catalog-source").textContent = "CATÁLOGO DE DEMONSTRAÇÃO";
    message.hidden = true;
    renderCatalog();
    return;
  }

  const controller = new AbortController();
  currentRequest = controller;
  $("#catalog-source").textContent = "CATÁLOGO TMDB";
  message.textContent = "Buscando filmes no TMDb...";
  message.hidden = false;
  catalogGrid.setAttribute("aria-busy", "true");
  catalogGrid.replaceChildren(...renderCatalogSkeletons());
  $("#catalog-count").textContent = "";
  try {
    const endpoint = query ? "/search/movie" : "/movie/popular";
    const url = new URL(TMDB_API + endpoint);
    url.searchParams.set("language", "pt-BR");
    if (query) { url.searchParams.set("query", query); url.searchParams.set("include_adult", "false"); }
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? "token" : "network");
    const data = await response.json();
    catalog = (Array.isArray(data.results) ? data.results : []).map(normalizeTmdbFilm).filter(Boolean).slice(0, 16);
    message.hidden = true;
    renderCatalog();
  } catch (error) {
    if (error.name === "AbortError") return;
    if (error.message === "token") setToken("");
    catalog = DEMO_FILMS.filter(film => film.title.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
    $("#catalog-source").textContent = "CATÁLOGO DE DEMONSTRAÇÃO";
    message.textContent = error.message === "token"
      ? "O token não foi aceito pelo TMDb. A coleção de demonstração está disponível; confira o token nas configurações."
      : "Não foi possível acessar o TMDb agora. A coleção de demonstração está disponível.";
    message.hidden = false;
    renderCatalog();
  } finally {
    if (currentRequest === controller) currentRequest = null;
  }
}

document.querySelectorAll(".nav-button").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.go)));

$("#memory-prev").addEventListener("click", () => {
  const count = library.filter(film => film.note?.trim()).length;
  if (!count) return;
  currentMemoryIndex = (currentMemoryIndex - 1 + count) % count;
  renderMemoryCarousel();
});
$("#memory-next").addEventListener("click", () => {
  const count = library.filter(film => film.note?.trim()).length;
  if (!count) return;
  currentMemoryIndex = (currentMemoryIndex + 1) % count;
  renderMemoryCarousel();
});

$("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  loadCatalog($("#search-input").value.trim());
});

$("#sort-select").addEventListener("change", renderLibrary);
document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
  libraryFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach(option => {
    const chosen = option === button;
    option.classList.toggle("is-active", chosen);
    option.setAttribute("aria-pressed", String(chosen));
  });
  renderLibrary();
}));

// Delegação: os cartões são recriados a cada renderização, mas os ouvintes ficam nos contêineres.
[catalogGrid, libraryGrid].forEach(grid => grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button || !grid.contains(button)) return;
  if (button.dataset.action === "add") addToLibrary(button.dataset.id);
  else openDetail(button.dataset.id);
}));

$("#detail-status").addEventListener("change", updateDetailFields);
$("#detail-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedFilm) return;
  const id = $("#detail-id").value;
  const status = $("#detail-status").value;
  if (status === "remove") {
    library = library.filter(film => film.id !== id);
    showToast(`${selectedFilm.title} saiu da sua lista.`);
  } else {
    const old = library.find(film => film.id === id);
    const entry = {
      ...selectedFilm,
      status,
      rating: status === "watched" ? Number($("#detail-rating").value) : 0,
      watchedAt: status === "watched" ? $("#detail-date").value : "",
      note: $("#detail-note").value.trim(),
      updatedAt: Date.now()
    };
    library = old ? library.map(film => film.id === id ? entry : film) : [entry, ...library];
    showToast(`${selectedFilm.title} foi salvo no diário.`);
  }
  saveLibrary();
  renderAll();
  detailDialog.close();
});
$("#close-detail").addEventListener("click", () => detailDialog.close());

$("#open-settings").addEventListener("click", () => {
  $("#tmdb-token").value = "";
  $("#token-error").hidden = true;
  settingsDialog.showModal();
});
$("#close-settings").addEventListener("click", () => settingsDialog.close());
$("#tmdb-token").addEventListener("input", () => { $("#token-error").hidden = true; });
$("#settings-form").addEventListener("submit", event => {
  event.preventDefault();
  const token = $("#tmdb-token").value.trim();
    if (!token) {
      const error = $("#token-error");
      error.textContent = "Informe seu token de leitura para ativar o catálogo.";
      error.hidden = false;
      $("#tmdb-token").focus();
      return;
    }
  if (!setToken(token)) return;
  settingsDialog.close();
  $("#search-input").value = "";
  loadCatalog();
  switchView("explore");
});
$("#use-demo").addEventListener("click", () => {
  if (!setToken("")) return;
  settingsDialog.close();
  $("#search-input").value = "";
  loadCatalog();
  switchView("explore");
});

// O navegador permite fechar o dialog com Escape. Clicar fora também fecha.
[detailDialog, settingsDialog].forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
}));

window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", event => {
  if (!event.matches || !window.gsap) return;
  [catalogGrid, libraryGrid].forEach(grid => {
    (revealTriggersByGrid.get(grid) || []).forEach(trigger => trigger.kill());
    const cards = grid.querySelectorAll(".film-card");
    gsap.killTweensOf(cards);
    gsap.set(cards, { clearProps: "opacity,visibility,transform" });
  });
});

initMotion();
renderAll();
loadCatalog();
