/* Professor Dev Hub - Main Application Logic */

let FLASHCARDS = [];
let QUIZZES = [];
let currentCardIndex = 0;
let dueCards = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let deferredInstallPrompt = null;

// ========== Navigation ==========
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link, .bottom-nav-item, .feature-card').forEach(el => el.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(el => el.classList.add('active'));

  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');

  if (pageId === 'paths') renderPathsList();
  if (pageId === 'cards') renderCardsPage();
  if (pageId === 'quizzes') renderQuizzesList();
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', () => showPage(el.dataset.page));
});

document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
});
document.getElementById('closeSidebar')?.addEventListener('click', closeSidebar);
document.getElementById('overlay')?.addEventListener('click', closeSidebar);
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ========== Theme ==========
async function initTheme() {
  const saved = await DevHubDB.getSetting('theme') || localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeBtn').textContent = saved === 'dark' ? '☀️' : '🌙';
}

document.getElementById('themeBtn')?.addEventListener('click', async () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '☀️' : '🌙';
  await DevHubDB.setSetting('theme', next);
  localStorage.setItem('theme', next);
});

// ========== Progress ==========
async function loadProgress() {
  const progress = await DevHubDB.getProgress();
  document.getElementById('stat-chapters').textContent = progress.chaptersCompleted || 0;
  document.getElementById('stat-quizzes').textContent = progress.quizzesTaken || 0;
  document.getElementById('stat-cards').textContent = progress.cardsSeen || 0;

  const total = 40;
  const completed = (progress.chaptersCompleted || 0) + (progress.quizzesTaken || 0) + Math.floor((progress.cardsSeen || 0) / 5);
  const percent = Math.min(100, Math.round((completed / total) * 100));
  document.getElementById('overall-fill').style.width = percent + '%';
  document.getElementById('percent-complete').textContent = percent + '% complete';
  document.getElementById('streak-badge').textContent = `🔥 ${progress.streak || 0} day streak`;
}

async function loadJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + url);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ========== Install Prompt (PWA) ==========
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.remove('hidden');
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') {
    document.getElementById('installBtn')?.classList.add('hidden');
  }
  deferredInstallPrompt = null;
});

window.addEventListener('appinstalled', () => {
  document.getElementById('installBtn')?.classList.add('hidden');
  deferredInstallPrompt = null;
});

// ========== Learning Paths ==========
function renderPathsList() {
  const container = document.getElementById('paths-container');
  if (!container || !window.LEARNING_PATHS) return;

  container.innerHTML = `
    <h2 class="section-title">📚 Learning Paths</h2>
    ${window.LEARNING_PATHS.map(path => `
      <div class="path-card" data-path-id="${path.id}">
        <div class="path-icon" style="background:${path.color}22;color:${path.color}">${path.icon}</div>
        <div class="path-info">
          <h3>${path.title}</h3>
          <p>${path.description}</p>
          <span class="tag">${path.lessons.length} lessons</span>
        </div>
      </div>
    `).join('')}
  `;

  container.querySelectorAll('.path-card').forEach(card => {
    card.addEventListener('click', () => openPath(card.dataset.pathId));
  });
}

function openPath(pathId) {
  const path = window.LEARNING_PATHS.find(p => p.id === pathId);
  if (!path) return;

  const container = document.getElementById('paths-container');
  container.innerHTML = `
    <button class="back-btn" id="backToPaths">← Back to Paths</button>
    <h2 class="section-title">${path.icon} ${path.title}</h2>
    <p style="color:var(--text-muted);margin-bottom:1.25rem">${path.description}</p>
    <div class="lessons-list">
      ${path.lessons.map((lesson, i) => `
        <div class="lesson-card" data-path="${pathId}" data-lesson="${lesson.id}">
          <div class="lesson-num">${i + 1}</div>
          <div class="lesson-title">${lesson.title}</div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('backToPaths').addEventListener('click', renderPathsList);
  container.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => openLesson(card.dataset.path, card.dataset.lesson));
  });
}

function openLesson(pathId, lessonId) {
  const path = window.LEARNING_PATHS.find(p => p.id === pathId);
  const lesson = path?.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const container = document.getElementById('paths-container');
  container.innerHTML = `
    <button class="back-btn" id="backToPath">← Back to ${path.title}</button>
    <div class="content-card lesson-content">
      <h2>${lesson.title}</h2>
      <div class="lesson-body">${lesson.content}</div>
      <button class="btn btn-primary" id="markComplete" style="margin-top:1.5rem">Mark as Complete ✓</button>
    </div>
  `;

  document.getElementById('backToPath').addEventListener('click', () => openPath(pathId));
  document.getElementById('markComplete').addEventListener('click', async () => {
    const progress = await DevHubDB.getProgress();
    progress.chaptersCompleted = (progress.chaptersCompleted || 0) + 1;
    await DevHubDB.saveProgress(progress);
    await loadProgress();
    const btn = document.getElementById('markComplete');
    btn.textContent = 'Completed ✓';
    btn.disabled = true;
  });
}

// ========== Study Cards + SRS ==========
async function buildDueCards(category = 'all') {
  const source = category === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.category === category);
  const due = [];

  for (const card of source) {
    const srs = await DevHubDB.getCardSRS(card.id);
    if (SRS.isDue(srs)) due.push({ ...card, srs });
  }

  if (due.length === 0) {
    for (const card of source) {
      const srs = await DevHubDB.getCardSRS(card.id);
      due.push({ ...card, srs });
    }
  }
  return due;
}

async function renderCardsPage() {
  const container = document.getElementById('cards-container');
  if (!container) return;

  dueCards = await buildDueCards('all');
  currentCardIndex = 0;

  if (!dueCards.length) {
    container.innerHTML = '<p class="empty-state">No cards loaded yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="cards-header">
      <div class="card-counter">
        <span id="card-num">1</span> / <span id="card-total">${dueCards.length}</span>
        <span class="due-label">• SRS</span>
      </div>
      <select id="card-filter" class="filter-select">
        <option value="all">All</option>
        <option value="HTML">HTML</option>
        <option value="CSS">CSS</option>
        <option value="JavaScript">JavaScript</option>
        <option value="Python">Python</option>
        <option value="API">API</option>
        <option value="C#">C#</option>
      </select>
    </div>

    <div class="flashcard" id="flashcard">
      <div class="flashcard-face flashcard-front">
        <div class="card-category" id="card-category">HTML</div>
        <div class="card-term" id="card-term">Loading...</div>
        <div class="card-hint">Tap to reveal answer</div>
      </div>
      <div class="flashcard-face flashcard-back">
        <div class="card-answer" id="card-answer">Loading...</div>
      </div>
    </div>

    <div class="srs-rating hidden" id="srs-rating">
      <p class="rating-prompt">How well did you know this?</p>
      <div class="rating-buttons">
        <button class="btn rating-btn again" data-quality="0">Again</button>
        <button class="btn rating-btn hard" data-quality="1">Hard</button>
        <button class="btn rating-btn good" data-quality="2">Good</button>
        <button class="btn rating-btn easy" data-quality="3">Easy</button>
      </div>
      <div class="next-interval" id="next-interval"></div>
    </div>

    <div class="card-controls" id="card-controls">
      <button class="btn btn-primary" id="flipCard">Show Answer</button>
    </div>
  `;

  showCard(0);
  document.getElementById('flashcard').addEventListener('click', onFlip);
  document.getElementById('flipCard').addEventListener('click', onFlip);
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => rateCard(parseInt(btn.dataset.quality)));
  });
  document.getElementById('card-filter').addEventListener('change', async (e) => {
    dueCards = await buildDueCards(e.target.value);
    currentCardIndex = 0;
    document.getElementById('card-total').textContent = dueCards.length;
    showCard(0);
  });
}

function showCard(index) {
  if (!dueCards.length) return;
  const card = dueCards[index];
  document.getElementById('card-num').textContent = index + 1;
  document.getElementById('card-category').textContent = card.category;
  document.getElementById('card-term').textContent = card.term;
  document.getElementById('card-answer').textContent = card.answer;
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('srs-rating').classList.add('hidden');
  document.getElementById('card-controls').classList.remove('hidden');
  document.getElementById('next-interval').textContent = '';
}

function onFlip() {
  document.getElementById('flashcard').classList.add('flipped');
  document.getElementById('srs-rating').classList.remove('hidden');
  document.getElementById('card-controls').classList.add('hidden');
}

async function rateCard(quality) {
  const card = dueCards[currentCardIndex];
  if (!card) return;

  const updatedSRS = SRS.review(card.srs, quality);
  await DevHubDB.saveCardSRS(updatedSRS);

  const progress = await DevHubDB.getProgress();
  progress.cardsSeen = (progress.cardsSeen || 0) + 1;
  await DevHubDB.saveProgress(progress);
  await loadProgress();

  document.getElementById('next-interval').textContent = `Next review: ${SRS.formatInterval(updatedSRS.interval)}`;

  setTimeout(async () => {
    if (!SRS.isDue(updatedSRS)) dueCards.splice(currentCardIndex, 1);
    else {
      dueCards[currentCardIndex].srs = updatedSRS;
      currentCardIndex++;
    }
    if (currentCardIndex >= dueCards.length) currentCardIndex = 0;

    if (dueCards.length === 0) {
      const filter = document.getElementById('card-filter')?.value || 'all';
      dueCards = await buildDueCards(filter);
      currentCardIndex = 0;
    }
    document.getElementById('card-total').textContent = dueCards.length;
    showCard(currentCardIndex);
  }, 550);
}

// ========== Quizzes ==========
function renderQuizzesList() {
  const container = document.getElementById('quizzes-container');
  if (!container) return;

  if (!QUIZZES.length) {
    container.innerHTML = '<p class="empty-state">No quizzes loaded yet.</p>';
    return;
  }

  container.innerHTML = `
    <h2 class="section-title">❓ Interactive Quizzes</h2>
    <div class="quiz-list">
      ${QUIZZES.map(q => `
        <div class="path-card" data-quiz-id="${q.id}">
          <div class="path-icon" style="background:#6366f122;color:#6366f1">${q.icon || '❓'}</div>
          <div class="path-info">
            <h3>${q.title}</h3>
            <p>${q.questions.length} questions</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-quiz-id]').forEach(card => {
    card.addEventListener('click', () => startQuiz(card.dataset.quizId));
  });
}

function startQuiz(quizId) {
  currentQuiz = QUIZZES.find(q => q.id === quizId);
  if (!currentQuiz) return;
  currentQuestionIndex = 0;
  quizScore = 0;
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById('quizzes-container');
  const q = currentQuiz.questions[currentQuestionIndex];
  const total = currentQuiz.questions.length;
  const progressPercent = (currentQuestionIndex / total) * 100;

  container.innerHTML = `
    <button class="back-btn" id="quitQuiz">← Quit Quiz</button>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progressPercent}%"></div></div>
    <div class="question-meta">Question ${currentQuestionIndex + 1} of ${total}</div>
    <div class="content-card">
      <h3 class="question-text">${q.question}</h3>
      <div class="options">
        ${q.options.map((opt, i) => `
          <div class="option" data-index="${i}">
            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div id="feedback" class="hidden"></div>
      <button class="btn btn-primary hidden" id="nextQuestion" style="margin-top:1rem;width:100%">Next Question →</button>
    </div>
  `;

  document.getElementById('quitQuiz').addEventListener('click', renderQuizzesList);
  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => selectAnswer(parseInt(opt.dataset.index)));
  });
}

function selectAnswer(selectedIndex) {
  const q = currentQuiz.questions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextQuestion');

  options.forEach(o => o.style.pointerEvents = 'none');
  options[selectedIndex].classList.add(selectedIndex === q.correct ? 'correct' : 'wrong');
  options[q.correct].classList.add('correct');

  if (selectedIndex === q.correct) {
    quizScore++;
    feedback.className = 'feedback correct';
    feedback.textContent = '✓ Correct! ' + (q.explanation || '');
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = '✗ Incorrect. ' + (q.explanation || '');
  }

  feedback.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
  nextBtn.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) showQuestion();
    else showQuizResults();
  };
}

async function showQuizResults() {
  const container = document.getElementById('quizzes-container');
  const total = currentQuiz.questions.length;
  const percent = Math.round((quizScore / total) * 100);

  await DevHubDB.saveQuizResult({
    quizId: currentQuiz.id, title: currentQuiz.title, score: quizScore, total, percent
  });

  const progress = await DevHubDB.getProgress();
  progress.quizzesTaken = (progress.quizzesTaken || 0) + 1;
  await DevHubDB.saveProgress(progress);
  await loadProgress();

  container.innerHTML = `
    <div class="content-card" style="text-align:center;padding:2rem">
      <div style="font-size:3rem;margin-bottom:0.5rem">🎉</div>
      <h2>Quiz Complete!</h2>
      <div class="score-value">${percent}%</div>
      <p style="color:var(--text-muted);margin:0.5rem 0 1.5rem">You got ${quizScore} out of ${total} correct</p>
      <button class="btn btn-primary" id="retryQuiz">Try Again</button>
      <button class="btn btn-secondary" id="backToQuizzes" style="margin-left:0.5rem">Choose Topic</button>
    </div>
  `;

  document.getElementById('retryQuiz').addEventListener('click', () => startQuiz(currentQuiz.id));
  document.getElementById('backToQuizzes').addEventListener('click', renderQuizzesList);
}

// ========== Offline + SW ==========
function updateOnlineStatus() {
  const offlineBanner = document.getElementById('offline-banner');
  if (!navigator.onLine) offlineBanner?.classList.add('show');
  else offlineBanner?.classList.remove('show');
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

let swRegistration = null;
let refreshing = false;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then((reg) => {
      swRegistration = reg;
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (navigator.onLine) document.getElementById('update-banner')?.classList.add('show');
            else localStorage.setItem('updateWaiting', 'true');
          }
        });
      });
    }).catch(console.error);

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) { refreshing = true; window.location.reload(); }
  });
}

document.getElementById('refresh-btn')?.addEventListener('click', () => {
  if (swRegistration?.waiting) swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  else window.location.reload();
});

window.addEventListener('online', () => {
  if (localStorage.getItem('updateWaiting') === 'true') {
    document.getElementById('update-banner')?.classList.add('show');
    localStorage.removeItem('updateWaiting');
  }
});

// ========== Init ==========
document.addEventListener('DOMContentLoaded', async () => {
  await initTheme();
  await loadProgress();
  FLASHCARDS = await loadJSON('./data/flashcards.json');
  QUIZZES = await loadJSON('./data/quizzes.json');
  console.log(`Professor Dev Hub ready 🚀 — ${FLASHCARDS.length} cards, ${QUIZZES.length} quizzes, ${window.LEARNING_PATHS?.length || 0} paths`);
});
