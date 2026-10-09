const STORAGE_KEY = 'kabo-system-v1';

const sectionConfig = {
  dashboard: { title: 'Dashboard' },
  learning: { title: 'Learning' },
  ai: { title: 'AI & Technology' },
  programming: { title: 'Programming' },
  money: { title: 'Money & Cash Flow' },
  football: { title: 'Football' },
  fitness: { title: 'Body & Fitness' },
  observations: { title: 'Observation & Analysis' }
};

const defaultData = {
  learning: [],
  ai: [],
  programming: [],
  money: [],
  football: [],
  fitness: [],
  observations: []
};

const navButtons = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const pageTitle = document.getElementById('page-title');
const overviewGrid = document.getElementById('overviewGrid');
const emptyStateTemplate = document.getElementById('emptyStateTemplate');

function loadStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaultData, ...saved };
  } catch (error) {
    console.warn('Unable to read saved data; using defaults.', error);
    return { ...defaultData };
  }
}

function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to save data.', error);
    window.alert('Browser storage is unavailable, so this note could not be saved.');
  }
}

function getSectionEntries(section) {
  const storage = loadStore();
  return Array.isArray(storage[section]) ? storage[section] : [];
}

function showSection(sectionKey) {
  navButtons.forEach((button) => {
    const active = button.dataset.section === sectionKey;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  panels.forEach((panel) => {
    const isActive = panel.id === sectionKey;
    panel.classList.toggle('active', isActive);
  });

  pageTitle.textContent = sectionConfig[sectionKey]?.title || 'Dashboard';
}

function renderOverview() {
  const data = loadStore();
  const totalEntries = Object.values(data).reduce((sum, items) => sum + items.length, 0);
  const sections = Object.entries(data).map(([key, items]) => ({
    name: sectionConfig[key]?.title || key,
    count: items.length
  }));

  overviewGrid.innerHTML = '';

  sections.forEach(({ name, count }) => {
    const card = document.createElement('article');
    card.className = 'overview-card';
    card.innerHTML = `
      <h3>${escapeHtml(name)}</h3>
      <p class="stat">${count}</p>
    `;
    overviewGrid.appendChild(card);
  });

  const totalCard = document.createElement('article');
  totalCard.className = 'overview-card';
  totalCard.innerHTML = `
    <h3>Total entries</h3>
    <p class="stat">${totalEntries}</p>
  `;
  overviewGrid.appendChild(totalCard);
}

function renderEntries(sectionKey) {
  const container = document.querySelector(`.entry-list[data-list="${sectionKey}"]`);
  if (!container) return;

  const entries = getSectionEntries(sectionKey);
  container.innerHTML = '';

  if (!entries.length) {
    const clone = emptyStateTemplate.content.firstElementChild.cloneNode(true);
    container.appendChild(clone);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'entry-card';

    const safeTitle = escapeHtml(entry.title);
    const safeText = escapeHtml(entry.content);

    card.innerHTML = `
      <div class="entry-card-header">
        <h4>${safeTitle}</h4>
        <span class="entry-meta">${Number(entry.progress) || 0}%</span>
      </div>
      <p>${safeText}</p>
      <div class="entry-actions">
        <button type="button" class="delete-btn" data-delete="${entry.id}" aria-label="Delete ${safeTitle}">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function addEntry(sectionKey, title, content, progress) {
  const store = loadStore();
  const trimmedTitle = getSafeText(title);
  const trimmedContent = getSafeText(content);
  const normalizedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  if (!trimmedTitle || !trimmedContent) {
    window.alert('Please enter both a title and a description before saving.');
    return;
  }

  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: trimmedTitle,
    content: trimmedContent,
    progress: normalizedProgress
  };

  store[sectionKey] = [entry, ...store[sectionKey]];
  saveStore(store);
  renderOverview();
  renderEntries(sectionKey);
}

function deleteEntry(sectionKey, id) {
  const store = loadStore();
  store[sectionKey] = store[sectionKey].filter((item) => item.id !== id);
  saveStore(store);
  renderOverview();
  renderEntries(sectionKey);
}

function bindForms() {
  document.querySelectorAll('.entry-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const sectionKey = form.dataset.section;
      const formData = new FormData(form);
      const title = formData.get('title');
      const content = formData.get('content');
      const progress = formData.get('progress');

      addEntry(sectionKey, title, content, progress);
      form.reset();
      const progressField = form.querySelector('input[name="progress"]');
      if (progressField) progressField.value = '10';
    });
  });
}

function bindDeleteButtons() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-btn');
    if (!button) return;

    const sectionKey = button.closest('.entry-list')?.dataset.list;
    const id = button.dataset.delete;

    if (sectionKey && id) deleteEntry(sectionKey, id);
  });
}

function bindNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showSection(button.dataset.section);
    });
  });
}

function initialize() {
  bindNavigation();
  bindForms();
  bindDeleteButtons();

  Object.keys(sectionConfig).forEach((key) => renderEntries(key));
  renderOverview();
  showSection('dashboard');
}

initialize();
