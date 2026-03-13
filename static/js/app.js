/* ===== Vibe Coding Course — App Logic ===== */

let courseData = null;
let slidesCache = {};
let labsCache = {};
let currentModule = null;
let currentMode = 'presentation';
let currentSlideIndex = 0;
let currentSlides = [];
let currentLang = 'pt';

// Last module per day — only these have labs
let lastModulesPerDay = new Set();

// UI labels per language
const i18n = {
  en: {
    presentation: 'Presentation',
    laboratory: 'Laboratory',
    courseModules: 'Course Modules',
    day: 'Day',
    module: 'Module',
    modules: 'modules',
    moduleSingular: 'module',
    previous: '← Previous',
    next: 'Next →',
    noLab: 'No lab available for this module. Labs are only on the last module of each day.',
    instructions: 'Instructions',
    starterCode: 'Starter Code',
    validation: '✅ Validation Criteria',
    overline: 'TECHNICAL TRAINING · 5 DAYS · 15 MODULES',
    heroTitle: 'Programming with<br/>Artificial Intelligence',
    tips: '💡 Chunking Techniques',
    infoAiBadge: 'YES! I\'m made completely with AI!',
    infoTech: 'Tech Stack',
    infoLangs: 'Languages',
    infoContent: 'Content',
    infoDays: 'days',
    infoModules: 'modules',
    infoLabs: 'labs',
    infoBuilt: 'Built with',
    infoAuthor: 'Author',
    infoFooter: 'An AI-assisted development course platform — taught and built the vibe coding way.'
  },
  es: {
    presentation: 'Presentación',
    laboratory: 'Laboratorio',
    courseModules: 'Módulos del curso',
    day: 'Día',
    module: 'Módulo',
    modules: 'módulos',
    moduleSingular: 'módulo',
    previous: '← Anterior',
    next: 'Siguiente →',
    noLab: 'No hay laboratorio para este módulo. Los laboratorios están solo en el último módulo de cada día.',
    instructions: 'Instrucciones',
    starterCode: 'Código inicial',
    validation: '✅ Criterios de validación',
    overline: 'FORMACIÓN TÉCNICA · 5 DÍAS · 15 MÓDULOS',
    heroTitle: 'Programación con<br/>Inteligencia Artificial',
    tips: '💡 Técnicas de chunking',
    infoAiBadge: '¡SÍ! ¡Estoy hecha completamente con IA!',
    infoTech: 'Tecnologías',
    infoLangs: 'Idiomas',
    infoContent: 'Contenido',
    infoDays: 'días',
    infoModules: 'módulos',
    infoLabs: 'laboratorios',
    infoBuilt: 'Construida con',
    infoAuthor: 'Autor',
    infoFooter: 'Una plataforma de curso de desarrollo asistido por IA — enseñada y construida al estilo vibe coding.'
  },
  pt: {
    presentation: 'Apresentação',
    laboratory: 'Laboratório',
    courseModules: 'Módulos do curso',
    day: 'Dia',
    module: 'Módulo',
    modules: 'módulos',
    moduleSingular: 'módulo',
    previous: '← Anterior',
    next: 'Próximo →',
    noLab: 'Não há laboratório para este módulo. Os laboratórios estão apenas no último módulo de cada dia.',
    instructions: 'Instruções',
    starterCode: 'Código inicial',
    validation: '✅ Critérios de validação',
    overline: 'FORMAÇÃO TÉCNICA · 5 DIAS · 15 MÓDULOS',
    heroTitle: 'Programação com<br/>Inteligência Artificial',
    tips: '💡 Técnicas de chunking',
    infoAiBadge: 'SIM! Fui feita completamente com IA!',
    infoTech: 'Tecnologias',
    infoLangs: 'Idiomas',
    infoContent: 'Conteúdo',
    infoDays: 'dias',
    infoModules: 'módulos',
    infoLabs: 'laboratórios',
    infoBuilt: 'Construída com',
    infoAuthor: 'Autor',
    infoFooter: 'Uma plataforma de curso de desenvolvimento assistido por IA — ensinada e construída no estilo vibe coding.'
  },
  it: {
    presentation: 'Presentazione',
    laboratory: 'Laboratorio',
    courseModules: 'Moduli del corso',
    day: 'Giorno',
    module: 'Modulo',
    modules: 'moduli',
    moduleSingular: 'modulo',
    previous: '← Precedente',
    next: 'Successivo →',
    noLab: 'Nessun laboratorio disponibile per questo modulo. I laboratori sono solo nell\'ultimo modulo di ogni giorno.',
    instructions: 'Istruzioni',
    starterCode: 'Codice iniziale',
    validation: '✅ Criteri di validazione',
    overline: 'FORMAZIONE TECNICA · 5 GIORNI · 15 MODULI',
    heroTitle: 'Programmazione con<br/>Intelligenza Artificiale',
    tips: '💡 Tecniche di chunking',
    infoAiBadge: 'SÌ! Sono fatta completamente con IA!',
    infoTech: 'Tecnologie',
    infoLangs: 'Lingue',
    infoContent: 'Contenuto',
    infoDays: 'giorni',
    infoModules: 'moduli',
    infoLabs: 'laboratori',
    infoBuilt: 'Costruita con',
    infoAuthor: 'Autore',
    infoFooter: 'Una piattaforma di corso di sviluppo assistito dall\'IA — insegnata e costruita nello stile vibe coding.'
  }
};

function t(key) { return i18n[currentLang][key] || key; }

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  courseData = await fetchJSON(`/api/course?lang=${currentLang}`);
  buildLastModuleSet();
  renderSidebar();
  renderLanding();
  updateUILabels();
  bindKeys();
}

function buildLastModuleSet() {
  lastModulesPerDay = new Set();
  for (const day of courseData.days) {
    const last = day.modules[day.modules.length - 1];
    lastModulesPerDay.add(last.id);
  }
}

async function changeLang(lang) {
  currentLang = lang;
  slidesCache = {};
  labsCache = {};
  courseData = await fetchJSON(`/api/course?lang=${currentLang}`);
  buildLastModuleSet();
  renderSidebar();
  updateUILabels();
  if (currentModule) {
    await selectModule(currentModule);
  } else {
    renderLanding();
    hideAll();
    document.getElementById('landing').classList.remove('hidden');
  }
}

function updateUILabels() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelector('.sidebar-header h3').textContent = t('courseModules');
  document.getElementById('btn-prev').textContent = t('previous');
  document.getElementById('btn-next').textContent = t('next');
}

/* ---------- Fetch helper ---------- */
async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

/* ---------- Sidebar ---------- */
function renderSidebar() {
  const nav = document.getElementById('course-nav');
  nav.innerHTML = courseData.days.map(day => `
    <div class="day-group">
      <div class="day-label" onclick="toggleDay(this)">
        <span class="arrow">▼</span>
        ${t('day')} ${day.day} — ${day.title}
      </div>
      <ul class="module-list">
        ${day.modules.map(m => `
          <li class="module-item${m.completed ? ' completed' : ''}" data-id="${m.id}" onclick="selectModule('${m.id}')">
            <span class="module-number">${m.completed ? '✔\uFE0E' : String(m.number).padStart(2, '0')}</span>
            ${m.title}
            ${lastModulesPerDay.has(m.id) ? '<span class="lab-indicator">🧪</span>' : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function toggleDay(el) {
  el.classList.toggle('collapsed');
}

/* ---------- Landing ---------- */
function renderLanding() {
  // Tags
  document.getElementById('tags').innerHTML =
    courseData.tags.map(t => `<span class="tag">${t}</span>`).join('');

  // Hero
  document.querySelector('.overline').textContent = t('overline');
  document.querySelector('.hero h1').innerHTML = courseData.title;
  document.querySelector('.subtitle').textContent = courseData.subtitle;

  // Day grid
  document.getElementById('day-grid').innerHTML =
    courseData.days.map(day => `
      <div class="day-card" onclick="selectModule('${day.modules[0].id}')">
        <div class="day-num">${String(day.day).padStart(2, '0')}</div>
        <div class="day-title">${t('day')} ${day.day}: ${day.title}</div>
        <div class="day-modules">${day.modules.length} ${day.modules.length > 1 ? t('modules') : t('moduleSingular')}</div>
      </div>
    `).join('');
}

/* ---------- Module selection ---------- */
async function selectModule(moduleId) {
  currentModule = moduleId;

  // Highlight sidebar
  document.querySelectorAll('.module-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === moduleId);
  });

  // Load data if not cached
  if (!slidesCache[moduleId]) {
    slidesCache[moduleId] = await fetchJSON(`/api/slides/${moduleId}?lang=${currentLang}`);
  }
  if (!labsCache[moduleId] && lastModulesPerDay.has(moduleId)) {
    labsCache[moduleId] = await fetchJSON(`/api/labs/${moduleId}?lang=${currentLang}`);
  }

  if (currentMode === 'presentation') {
    showPresentation(moduleId);
  } else {
    showLab(moduleId);
  }
}

/* ---------- Mode switcher ---------- */
function switchMode(mode) {
  currentMode = mode;

  document.querySelectorAll('.btn-mode').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });

  if (currentModule) {
    if (mode === 'presentation') showPresentation(currentModule);
    else showLab(currentModule);
  }
}

/* ---------- Presentation ---------- */
function showPresentation(moduleId) {
  hideAll();
  document.getElementById('presentation-view').classList.remove('hidden');

  currentSlides = slidesCache[moduleId] || [];
  currentSlideIndex = 0;
  renderSlide();
}

function renderSlide() {
  if (!currentSlides.length) return;

  const slide = currentSlides[currentSlideIndex];
  const moduleInfo = findModule(currentModule);

  document.getElementById('slide-badge').textContent =
    `${t('module')} ${moduleInfo.number} — ${moduleInfo.title}`;
  document.getElementById('slide-title').textContent = slide.title;
  document.getElementById('slide-subtitle').textContent = slide.content || '';

  const body = document.getElementById('slide-body');
  body.innerHTML = '';

  // Diagram
  if (slide.diagram) {
    body.innerHTML += renderDiagram(slide.diagram);
  }

  // Columns
  if (slide.columns) {
    body.innerHTML += renderColumns(slide.columns);
  }

  // Steps
  if (slide.steps) {
    body.innerHTML += renderSteps(slide.steps);
  }

  // Branches
  if (slide.branches) {
    body.innerHTML += renderBranches(slide.branches);
  }

  // Flow diagram
  if (slide.flow_diagram) {
    body.innerHTML += renderFlowDiagram(slide.flow_diagram);
  }

  // Branch diagram
  if (slide.branch_diagram) {
    body.innerHTML += renderBranchDiagram(slide.branch_diagram);
  }

  // Prompts
  if (slide.prompts) {
    body.innerHTML += renderPrompts(slide.prompts);
  }

  // Pipeline
  if (slide.pipeline) {
    body.innerHTML += renderPipeline(slide.pipeline);
  }

  // Tips
  if (slide.tips) {
    body.innerHTML += renderTips(slide.tips);
  }

  // Table
  if (slide.table) {
    body.innerHTML += renderTable(slide.table);
  }

  // Counter & nav
  document.getElementById('slide-counter').textContent =
    `${currentSlideIndex + 1} / ${currentSlides.length}`;
  document.getElementById('btn-prev').disabled = currentSlideIndex === 0;
  document.getElementById('btn-next').disabled = currentSlideIndex === currentSlides.length - 1;
}

function nextSlide() {
  if (currentSlideIndex < currentSlides.length - 1) {
    currentSlideIndex++;
    renderSlide();
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide();
  }
}

/* ---------- Slide renderers ---------- */
function renderColumns(cols) {
  return `<div class="slide-columns">${cols.map(c => `
    <div class="slide-column">
      <div class="col-icon">${c.icon || ''}</div>
      <h4>${c.heading}</h4>
      <ul>${c.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>
  `).join('')}</div>`;
}

function renderDiagram(diagram) {
  return `<div class="slide-diagram">${diagram.layers.map((l, i) => `
    ${i > 0 ? '<div class="diagram-arrow">▲</div>' : ''}
    <div class="diagram-layer"><strong>${escapeHtml(l.label)}</strong><br/>${escapeHtml(l.desc)}</div>
  `).join('')}</div>`;
}

function renderTable(table) {
  const hdr = table.headers.map(h =>
    `<th><span class="table-icon">${h.icon || ''}</span>${escapeHtml(h.label)}<br/><small>${escapeHtml(h.sub || '')}</small></th>`
  ).join('');
  const rows = table.rows.map(r => {
    const cells = r.cells.map(c =>
      `<td style="border-left:3px solid ${c.color || 'transparent'}">${escapeHtml(c.text)}</td>`
    ).join('');
    return `<tr><td class="table-row-label" style="color:${r.color || 'inherit'}">${escapeHtml(r.label)}</td>${cells}</tr>`;
  }).join('');
  return `<div class="slide-table-wrap"><table class="slide-table"><thead><tr><th></th>${hdr}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderSteps(steps) {
  return `<div class="slide-steps">${steps.map(s => `
    <div class="step-item">
      <div class="step-num">${s.number}</div>
      <div class="step-content">
        <h4>${escapeHtml(s.label)}</h4>
        <p>${escapeHtml(s.desc)}</p>
      </div>
    </div>
  `).join('')}</div>`;
}

function renderBranches(branches) {
  return `<div class="slide-branches">${branches.map(b => `
    <div class="branch-item">
      <div class="branch-dot" style="background:${b.color}"></div>
      <span class="branch-name">${escapeHtml(b.name)}</span>
      <span class="branch-desc">${escapeHtml(b.desc)}</span>
    </div>
  `).join('')}</div>`;
}

function renderFlowDiagram(flow) {
  const steps = flow.steps.map((s, i) => `
    <div class="flow-step">
      <div class="flow-step-header" style="border-color:${s.color}">
        <span class="flow-step-branch" style="background:${s.color}">${escapeHtml(s.branch)}</span>
      </div>
      <div class="flow-step-body">
        <strong>${escapeHtml(s.action)}</strong>
        <p>${escapeHtml(s.detail)}</p>
        ${s.environment ? `<div class="flow-env">${s.environment}</div>` : ''}
        ${s.check ? `<div class="flow-check">${s.check}</div>` : ''}
      </div>
    </div>
    ${s.arrow ? `<div class="flow-arrow">▼<span class="flow-arrow-label">${escapeHtml(s.arrow)}</span></div>` : ''}
  `).join('');
  return `<div class="slide-flow-diagram">
    ${steps}
    <div class="flow-summary"><strong>${escapeHtml(flow.summary)}</strong></div>
  </div>`;
}

function renderBranchDiagram(diagram) {
  const mainFlow = diagram.main_flow.map((node, i) => `
    <div class="bd-node">
      <div class="bd-branch" style="background:${node.color}">${escapeHtml(node.branch)}</div>
      <div class="bd-env">${node.env ? node.env : '💻 local'}</div>
      <div class="bd-desc">${escapeHtml(node.desc)}</div>
    </div>
    ${i < diagram.main_flow.length - 1 ? '<div class="bd-arrow">→</div>' : ''}
  `).join('');
  const hotfix = diagram.hotfix ? `
    <div class="bd-hotfix">
      <div class="bd-hotfix-line" style="border-color:${diagram.hotfix.color}">
        <span class="bd-hotfix-label" style="background:${diagram.hotfix.color}">🔥 ${escapeHtml(diagram.hotfix.branch)}</span>
        <span class="bd-hotfix-desc">${escapeHtml(diagram.hotfix.desc)}</span>
        <span class="bd-hotfix-arrows">${escapeHtml(diagram.hotfix.flow)}</span>
      </div>
    </div>
  ` : '';
  return `<div class="slide-branch-diagram">
    <div class="bd-main-flow">${mainFlow}</div>
    ${hotfix}
  </div>`;
}

function renderPrompts(prompts) {
  return `<div class="slide-prompts">${prompts.map(p => `
    <div class="prompt-card">
      <div class="prompt-label">${p.icon || ''} ${escapeHtml(p.label)}</div>
      <pre class="prompt-text">${escapeHtml(p.text)}</pre>
    </div>
  `).join('')}</div>`;
}

function renderPipeline(stages) {
  return `<div class="slide-pipeline">${stages.map(s => `
    <div class="pipeline-stage">
      <div class="stage-icon">${s.icon || ''}</div>
      <h4>${escapeHtml(s.stage)}: ${escapeHtml(s.label)}</h4>
      <ul>${s.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>
  `).join('')}</div>`;
}

function renderTips(tips) {
  return `<div class="slide-tips">
    <h4>${t('tips')}</h4>
    <ul>${tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>
  </div>`;
}

/* ---------- Lab view ---------- */
function showLab(moduleId) {
  hideAll();
  document.getElementById('lab-view').classList.remove('hidden');

  if (!lastModulesPerDay.has(moduleId)) {
    document.getElementById('lab-title').textContent = t('noLab');
    document.getElementById('lab-objective').textContent = '';
    document.getElementById('lab-duration').textContent = '';
    document.getElementById('lab-exercises').innerHTML = '';
    return;
  }

  const lab = labsCache[moduleId];
  if (!lab || !lab.exercises) {
    document.getElementById('lab-title').textContent = t('noLab');
    document.getElementById('lab-objective').textContent = '';
    document.getElementById('lab-duration').textContent = '';
    document.getElementById('lab-exercises').innerHTML = '';
    return;
  }

  document.getElementById('lab-title').textContent = lab.title;
  document.getElementById('lab-objective').textContent = lab.objective;
  document.getElementById('lab-duration').textContent = `⏱ ${lab.duration}`;

  document.getElementById('lab-exercises').innerHTML = lab.exercises.map(ex => `
    <div class="exercise-card">
      <div class="exercise-header" onclick="toggleExercise(this)">
        <div class="exercise-left">
          <span class="exercise-id">${escapeHtml(ex.id)}</span>
          <span class="exercise-title">${escapeHtml(ex.title)}</span>
        </div>
        <div class="exercise-badges">
          <span class="badge badge-${ex.difficulty}">${ex.difficulty}</span>
          <span class="badge badge-type">${ex.type}</span>
          <span class="exercise-toggle">▼</span>
        </div>
      </div>
      <div class="exercise-body">
        <h4>${t('instructions')}</h4>
        <div class="instructions">${escapeHtml(ex.instructions)}</div>
        ${ex.starter_code ? `<h4>${t('starterCode')}</h4><pre>${escapeHtml(ex.starter_code)}</pre>` : ''}
        ${ex.validation ? `<h4>${t('validation')}</h4><div class="validation">${escapeHtml(ex.validation)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleExercise(header) {
  const body = header.nextElementSibling;
  body.classList.toggle('open');
  const arrow = header.querySelector('.exercise-toggle');
  arrow.textContent = body.classList.contains('open') ? '▲' : '▼';
}

/* ---------- Helpers ---------- */
function hideAll() {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('presentation-view').classList.add('hidden');
  document.getElementById('lab-view').classList.add('hidden');
}

function findModule(moduleId) {
  for (const day of courseData.days) {
    const m = day.modules.find(m => m.id === moduleId);
    if (m) return m;
  }
  return { number: '?', title: '' };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ---------- Theme ---------- */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}

/* ---------- Info Modal ---------- */
function toggleInfoModal() {
  document.getElementById('info-overlay').classList.toggle('hidden');
}

/* ---------- Keyboard navigation ---------- */
function bindKeys() {
  document.addEventListener('keydown', e => {
    if (currentMode !== 'presentation') return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Escape') {
      const overlay = document.getElementById('info-overlay');
      if (!overlay.classList.contains('hidden')) overlay.classList.add('hidden');
    }
  });
}

/* ---------- Toast ---------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
}
