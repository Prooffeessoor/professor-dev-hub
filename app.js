/* Professor Dev Hub - Main Application Logic */

let FLASHCARDS = [];
let QUIZZES = [];
let LABS = [];
let CHALLENGES = [];
let GAMES = [];
let currentCardIndex = 0;
let dueCards = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let deferredInstallPrompt = null;

// Match game state
let matchTiles = [];
let matchFlipped = [];
let matchMatched = 0;
let matchMoves = 0;
let matchLocked = false;

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
  if (pageId === 'labs') renderLabsList();
  if (pageId === 'challenges') renderChallengesList();
  if (pageId === 'games') renderGamesList();
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

async function loadProgress() {
  const progress = await DevHubDB.getProgress();
  document.getElementById('stat-chapters').textContent = progress.chaptersCompleted || 0;
  document.getElementById('stat-quizzes').textContent = progress.quizzesTaken || 0;
  document.getElementById('stat-cards').textContent = progress.cardsSeen || 0;
  const total = 50;
  const completed = (progress.chaptersCompleted || 0) + (progress.quizzesTaken || 0) + Math.floor((progress.cardsSeen || 0) / 5);
  const percent = Math.min(100, Math.round((completed / total) * 100));
  document.getElementById('overall-fill').style.width = percent + '%';
  document.getElementById('percent-complete').textContent = percent + '% complete';
  document.getElementById('streak-badge').textContent = `🔥 ${progress.streak || 0} day streak`;
}

async function loadJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed ' + url);
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  document.getElementById('installBtn')?.classList.remove('hidden');
});
document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') document.getElementById('installBtn')?.classList.add('hidden');
  deferredInstallPrompt = null;
});
window.addEventListener('appinstalled', () => {
  document.getElementById('installBtn')?.classList.add('hidden');
  deferredInstallPrompt = null;
});

// ===== Paths =====
function renderPathsList() {
  const container = document.getElementById('paths-container');
  if (!container || !window.LEARNING_PATHS) return;
  container.innerHTML = `<h2 class="section-title">📚 Learning Paths</h2>` +
    window.LEARNING_PATHS.map(path => `
      <div class="path-card" data-path-id="${path.id}">
        <div class="path-icon" style="background:${path.color}22;color:${path.color}">${path.icon}</div>
        <div class="path-info"><h3>${path.title}</h3><p>${path.description}</p><span class="tag">${path.lessons.length} lessons</span></div>
      </div>`).join('');
  container.querySelectorAll('.path-card').forEach(c => c.addEventListener('click', () => openPath(c.dataset.pathId)));
}
function openPath(pathId) {
  const path = window.LEARNING_PATHS.find(p => p.id === pathId);
  if (!path) return;
  const container = document.getElementById('paths-container');
  container.innerHTML = `
    <button class="back-btn" id="backToPaths">← Back to Paths</button>
    <h2 class="section-title">${path.icon} ${path.title}</h2>
    <p style="color:var(--text-muted);margin-bottom:1.25rem">${path.description}</p>
    ${path.lessons.map((lesson, i) => `
      <div class="lesson-card" data-path="${pathId}" data-lesson="${lesson.id}">
        <div class="lesson-num">${i + 1}</div><div class="lesson-title">${lesson.title}</div>
      </div>`).join('')}`;
  document.getElementById('backToPaths').addEventListener('click', renderPathsList);
  container.querySelectorAll('.lesson-card').forEach(c => c.addEventListener('click', () => openLesson(c.dataset.path, c.dataset.lesson)));
}
function openLesson(pathId, lessonId) {
  const path = window.LEARNING_PATHS.find(p => p.id === pathId);
  const lesson = path?.lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  const container = document.getElementById('paths-container');
  container.innerHTML = `
    <button class="back-btn" id="backToPath">← Back to ${path.title}</button>
    <div class="content-card lesson-content">
      <h2>${lesson.title}</h2><div class="lesson-body">${lesson.content}</div>
      <button class="btn btn-primary" id="markComplete" style="margin-top:1.5rem">Mark as Complete ✓</button>
    </div>`;
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

// ===== Cards + SRS (unchanged core) =====
async function buildDueCards(category = 'all') {
  const source = category === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.category === category);
  const due = [];
  for (const card of source) {
    const srs = await DevHubDB.getCardSRS(card.id);
    if (SRS.isDue(srs)) due.push({ ...card, srs });
  }
  if (!due.length) {
    for (const card of source) due.push({ ...card, srs: await DevHubDB.getCardSRS(card.id) });
  }
  return due;
}
async function renderCardsPage() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  dueCards = await buildDueCards('all');
  currentCardIndex = 0;
  if (!dueCards.length) { container.innerHTML = '<p class="empty-state">No cards loaded.</p>'; return; }
  container.innerHTML = `
    <div class="cards-header">
      <div class="card-counter"><span id="card-num">1</span> / <span id="card-total">${dueCards.length}</span> <span class="due-label">• SRS</span></div>
      <select id="card-filter" class="filter-select">
        <option value="all">All</option><option value="HTML">HTML</option><option value="CSS">CSS</option>
        <option value="JavaScript">JavaScript</option><option value="Python">Python</option>
        <option value="API">API</option><option value="C#">C#</option>
      </select>
    </div>
    <div class="flashcard" id="flashcard">
      <div class="flashcard-face flashcard-front">
        <div class="card-category" id="card-category"></div>
        <div class="card-term" id="card-term"></div>
        <div class="card-hint">Tap to reveal</div>
      </div>
      <div class="flashcard-face flashcard-back"><div class="card-answer" id="card-answer"></div></div>
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
    <div class="card-controls" id="card-controls"><button class="btn btn-primary" id="flipCard">Show Answer</button></div>`;
  showCard(0);
  document.getElementById('flashcard').addEventListener('click', onFlip);
  document.getElementById('flipCard').addEventListener('click', onFlip);
  document.querySelectorAll('.rating-btn').forEach(btn => btn.addEventListener('click', () => rateCard(+btn.dataset.quality)));
  document.getElementById('card-filter').addEventListener('change', async (e) => {
    dueCards = await buildDueCards(e.target.value);
    currentCardIndex = 0;
    document.getElementById('card-total').textContent = dueCards.length;
    showCard(0);
  });
}
function showCard(i) {
  if (!dueCards.length) return;
  const c = dueCards[i];
  document.getElementById('card-num').textContent = i + 1;
  document.getElementById('card-category').textContent = c.category;
  document.getElementById('card-term').textContent = c.term;
  document.getElementById('card-answer').textContent = c.answer;
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
  const updated = SRS.review(card.srs, quality);
  await DevHubDB.saveCardSRS(updated);
  const progress = await DevHubDB.getProgress();
  progress.cardsSeen = (progress.cardsSeen || 0) + 1;
  await DevHubDB.saveProgress(progress);
  await loadProgress();
  document.getElementById('next-interval').textContent = `Next review: ${SRS.formatInterval(updated.interval)}`;
  setTimeout(async () => {
    if (!SRS.isDue(updated)) dueCards.splice(currentCardIndex, 1);
    else { dueCards[currentCardIndex].srs = updated; currentCardIndex++; }
    if (currentCardIndex >= dueCards.length) currentCardIndex = 0;
    if (!dueCards.length) {
      dueCards = await buildDueCards(document.getElementById('card-filter')?.value || 'all');
      currentCardIndex = 0;
    }
    document.getElementById('card-total').textContent = dueCards.length;
    showCard(currentCardIndex);
  }, 550);
}

// ===== Quizzes =====
function renderQuizzesList() {
  const container = document.getElementById('quizzes-container');
  if (!container) return;
  if (!QUIZZES.length) { container.innerHTML = '<p class="empty-state">No quizzes.</p>'; return; }
  container.innerHTML = `<h2 class="section-title">❓ Interactive Quizzes</h2>` +
    QUIZZES.map(q => `
      <div class="path-card" data-quiz-id="${q.id}">
        <div class="path-icon" style="background:#6366f122;color:#6366f1">${q.icon || '❓'}</div>
        <div class="path-info"><h3>${q.title}</h3><p>${q.questions.length} questions</p></div>
      </div>`).join('');
  container.querySelectorAll('[data-quiz-id]').forEach(c => c.addEventListener('click', () => startQuiz(c.dataset.quizId)));
}
function startQuiz(id) {
  currentQuiz = QUIZZES.find(q => q.id === id);
  if (!currentQuiz) return;
  currentQuestionIndex = 0; quizScore = 0; showQuestion();
}
function showQuestion() {
  const container = document.getElementById('quizzes-container');
  const q = currentQuiz.questions[currentQuestionIndex];
  const total = currentQuiz.questions.length;
  container.innerHTML = `
    <button class="back-btn" id="quitQuiz">← Quit</button>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(currentQuestionIndex/total)*100}%"></div></div>
    <div class="question-meta">Question ${currentQuestionIndex + 1} of ${total}</div>
    <div class="content-card">
      <h3 class="question-text">${q.question}</h3>
      <div class="options">${q.options.map((o,i) => `
        <div class="option" data-index="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${o}</span></div>`).join('')}
      </div>
      <div id="feedback" class="hidden"></div>
      <button class="btn btn-primary hidden" id="nextQuestion" style="margin-top:1rem;width:100%">Next →</button>
    </div>`;
  document.getElementById('quitQuiz').addEventListener('click', renderQuizzesList);
  document.querySelectorAll('.option').forEach(o => o.addEventListener('click', () => selectAnswer(+o.dataset.index)));
}
function selectAnswer(i) {
  const q = currentQuiz.questions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');
  options.forEach(o => o.style.pointerEvents = 'none');
  options[i].classList.add(i === q.correct ? 'correct' : 'wrong');
  options[q.correct].classList.add('correct');
  const feedback = document.getElementById('feedback');
  if (i === q.correct) { quizScore++; feedback.className = 'feedback correct'; feedback.textContent = '✓ ' + (q.explanation || 'Correct!'); }
  else { feedback.className = 'feedback wrong'; feedback.textContent = '✗ ' + (q.explanation || 'Incorrect'); }
  feedback.classList.remove('hidden');
  const next = document.getElementById('nextQuestion');
  next.classList.remove('hidden');
  next.onclick = () => { currentQuestionIndex++; currentQuestionIndex < currentQuiz.questions.length ? showQuestion() : showQuizResults(); };
}
async function showQuizResults() {
  const container = document.getElementById('quizzes-container');
  const total = currentQuiz.questions.length;
  const percent = Math.round((quizScore / total) * 100);
  await DevHubDB.saveQuizResult({ quizId: currentQuiz.id, title: currentQuiz.title, score: quizScore, total, percent });
  const progress = await DevHubDB.getProgress();
  progress.quizzesTaken = (progress.quizzesTaken || 0) + 1;
  await DevHubDB.saveProgress(progress);
  await loadProgress();
  container.innerHTML = `
    <div class="content-card" style="text-align:center;padding:2rem">
      <div style="font-size:3rem">🎉</div><h2>Quiz Complete!</h2>
      <div class="score-value">${percent}%</div>
      <p style="color:var(--text-muted);margin:0.5rem 0 1.5rem">${quizScore}/${total} correct</p>
      <button class="btn btn-primary" id="retryQuiz">Try Again</button>
      <button class="btn btn-secondary" id="backToQuizzes" style="margin-left:0.5rem">Topics</button>
    </div>`;
  document.getElementById('retryQuiz').addEventListener('click', () => startQuiz(currentQuiz.id));
  document.getElementById('backToQuizzes').addEventListener('click', renderQuizzesList);
}

// ===== Practical Labs =====
function renderLabsList() {
  const container = document.getElementById('labs-container');
  if (!container) return;
  if (!LABS.length) { container.innerHTML = '<p class="empty-state">No labs loaded.</p>'; return; }
  container.innerHTML = `<h2 class="section-title">🧪 Practical Labs</h2>` +
    LABS.map(lab => `
      <div class="path-card" data-lab-id="${lab.id}">
        <div class="path-icon" style="background:#10b98122;color:#10b981">${lab.icon}</div>
        <div class="path-info">
          <h3>${lab.title}</h3>
          <p>${lab.goal}</p>
          <span class="tag">${lab.level}</span> <span class="tag">${lab.time}</span>
        </div>
      </div>`).join('');
  container.querySelectorAll('[data-lab-id]').forEach(c => c.addEventListener('click', () => openLab(c.dataset.labId)));
}
function openLab(id) {
  const lab = LABS.find(l => l.id === id);
  if (!lab) return;
  const container = document.getElementById('labs-container');
  container.innerHTML = `
    <button class="back-btn" id="backLabs">← All Labs</button>
    <div class="content-card">
      <h2>${lab.icon} ${lab.title}</h2>
      <p style="color:var(--text-muted);margin:0.5rem 0 1rem">${lab.goal}</p>
      <div class="meta-row"><span class="tag">${lab.level}</span> <span class="tag">${lab.topic}</span> <span class="tag">${lab.time}</span></div>
      <h3 style="margin:1.25rem 0 0.75rem">Steps</h3>
      <ol class="lab-steps" id="lab-steps">
        ${lab.steps.map((s, i) => `<li><label><input type="checkbox" data-step="${i}"> ${s}</label></li>`).join('')}
      </ol>
      <button class="btn btn-secondary" id="showHint" style="margin-top:1rem">Show Hint</button>
      <button class="btn btn-secondary" id="showSolution" style="margin-top:1rem;margin-left:0.5rem">Show Solution</button>
      <div id="lab-extra" class="hidden" style="margin-top:1rem"></div>
      <button class="btn btn-primary" id="completeLab" style="margin-top:1.25rem;width:100%">Mark Lab Complete ✓</button>
    </div>`;
  document.getElementById('backLabs').addEventListener('click', renderLabsList);
  document.getElementById('showHint').addEventListener('click', () => {
    const el = document.getElementById('lab-extra');
    el.classList.remove('hidden');
    el.innerHTML = `<div class="highlight-box"><strong>Hint:</strong> ${lab.hint}</div>`;
  });
  document.getElementById('showSolution').addEventListener('click', () => {
    const el = document.getElementById('lab-extra');
    el.classList.remove('hidden');
    el.innerHTML = `<div class="highlight-box"><strong>Solution tip:</strong> ${lab.solution}</div>`;
  });
  document.getElementById('completeLab').addEventListener('click', async () => {
    const progress = await DevHubDB.getProgress();
    progress.chaptersCompleted = (progress.chaptersCompleted || 0) + 1;
    await DevHubDB.saveProgress(progress);
    await loadProgress();
    const btn = document.getElementById('completeLab');
    btn.textContent = 'Completed ✓';
    btn.disabled = true;
  });
}

// ===== Coding Challenges =====
function renderChallengesList() {
  const container = document.getElementById('challenges-container');
  if (!container) return;
  if (!CHALLENGES.length) { container.innerHTML = '<p class="empty-state">No challenges.</p>'; return; }
  container.innerHTML = `<h2 class="section-title">🎯 Coding Challenges</h2>` +
    CHALLENGES.map(ch => `
      <div class="path-card" data-ch-id="${ch.id}">
        <div class="path-icon" style="background:#f59e0b22;color:#f59e0b">${ch.icon === 'buzz' ? '🐝' : ch.icon}</div>
        <div class="path-info">
          <h3>${ch.title}</h3>
          <p>${ch.prompt.slice(0, 80)}${ch.prompt.length > 80 ? '…' : ''}</p>
          <span class="tag">${ch.level}</span> <span class="tag">${ch.topic}</span>
        </div>
      </div>`).join('');
  container.querySelectorAll('[data-ch-id]').forEach(c => c.addEventListener('click', () => openChallenge(c.dataset.chId)));
}
function openChallenge(id) {
  const ch = CHALLENGES.find(c => c.id === id);
  if (!ch) return;
  const container = document.getElementById('challenges-container');
  container.innerHTML = `
    <button class="back-btn" id="backCh">← Challenges</button>
    <div class="content-card">
      <h2>${ch.title}</h2>
      <div class="meta-row" style="margin:0.5rem 0"><span class="tag">${ch.level}</span> <span class="tag">${ch.topic}</span></div>
      <p style="margin:1rem 0">${ch.prompt}</p>
      <p><strong>Example:</strong> <code>${ch.example}</code></p>
      <h3 style="margin:1.25rem 0 0.5rem">Starter</h3>
      <pre class="code-block"><code>${escapeHtml(ch.starter)}</code></pre>
      <button class="btn btn-secondary" id="chHint">Hint</button>
      <button class="btn btn-secondary" id="chSol" style="margin-left:0.5rem">Solution</button>
      <div id="ch-extra" class="hidden" style="margin-top:1rem"></div>
      <button class="btn btn-primary" id="completeCh" style="margin-top:1.25rem;width:100%">I Solved It ✓</button>
    </div>`;
  document.getElementById('backCh').addEventListener('click', renderChallengesList);
  document.getElementById('chHint').addEventListener('click', () => {
    const el = document.getElementById('ch-extra');
    el.classList.remove('hidden');
    el.innerHTML = `<div class="highlight-box"><strong>Hint:</strong> ${ch.hint}</div>`;
  });
  document.getElementById('chSol').addEventListener('click', () => {
    const el = document.getElementById('ch-extra');
    el.classList.remove('hidden');
    el.innerHTML = `<h4>Solution</h4><pre class="code-block"><code>${escapeHtml(ch.solution)}</code></pre>`;
  });
  document.getElementById('completeCh').addEventListener('click', async () => {
    const progress = await DevHubDB.getProgress();
    progress.chaptersCompleted = (progress.chaptersCompleted || 0) + 1;
    await DevHubDB.saveProgress(progress);
    await loadProgress();
    const btn = document.getElementById('completeCh');
    btn.textContent = 'Nice work! ✓';
    btn.disabled = true;
  });
}
function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===== Games: Term Match =====
function renderGamesList() {
  const container = document.getElementById('games-container');
  if (!container) return;
  if (!GAMES.length) { container.innerHTML = '<p class="empty-state">No games.</p>'; return; }
  container.innerHTML = `<h2 class="section-title">🎮 Games</h2>` +
    GAMES.map(g => `
      <div class="path-card" data-game-id="${g.id}">
        <div class="path-icon" style="background:#8b5cf622;color:#8b5cf6">${g.icon}</div>
        <div class="path-info"><h3>${g.title}</h3><p>${g.description}</p></div>
      </div>`).join('');
  container.querySelectorAll('[data-game-id]').forEach(c => c.addEventListener('click', () => startMatchGame(c.dataset.gameId)));
}
function startMatchGame(id) {
  const game = GAMES.find(g => g.id === id);
  if (!game) return;
  matchMoves = 0;
  matchMatched = 0;
  matchFlipped = [];
  matchLocked = false;
  // Build tiles: term + def for each pair
  const tiles = [];
  game.pairs.forEach((p, i) => {
    tiles.push({ id: i + 't', pairId: i, text: p.term, type: 'term' });
    tiles.push({ id: i + 'd', pairId: i, text: p.def, type: 'def' });
  });
  // Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  matchTiles = tiles;
  renderMatchBoard(game);
}
function renderMatchBoard(game) {
  const container = document.getElementById('games-container');
  container.innerHTML = `
    <button class="back-btn" id="backGames">← Games</button>
    <div class="match-header">
      <h2>${game.icon} ${game.title}</h2>
      <div class="match-stats">Moves: <strong id="match-moves">0</strong> · Matched: <strong id="match-matched">0</strong>/${game.pairs.length}</div>
    </div>
    <div class="match-grid" id="match-grid">
      ${matchTiles.map((t, i) => `
        <button class="match-tile" data-index="${i}" aria-label="tile">
          <span class="tile-back">?</span>
          <span class="tile-front hidden">${t.text}</span>
        </button>`).join('')}
    </div>
    <div id="match-win" class="hidden content-card" style="text-align:center;margin-top:1rem">
      <div style="font-size:2.5rem">🏆</div>
      <h3>Board cleared!</h3>
      <p id="match-win-msg"></p>
      <button class="btn btn-primary" id="replayMatch">Play Again</button>
    </div>`;
  document.getElementById('backGames').addEventListener('click', renderGamesList);
  document.getElementById('replayMatch')?.addEventListener('click', () => startMatchGame(game.id));
  document.querySelectorAll('.match-tile').forEach(tile => {
    tile.addEventListener('click', () => onMatchFlip(+tile.dataset.index, game));
  });
}
function onMatchFlip(index, game) {
  if (matchLocked) return;
  const tile = matchTiles[index];
  const el = document.querySelector(`.match-tile[data-index="${index}"]`);
  if (!el || el.classList.contains('matched') || el.classList.contains('flipped')) return;

  el.classList.add('flipped');
  el.querySelector('.tile-back').classList.add('hidden');
  el.querySelector('.tile-front').classList.remove('hidden');
  matchFlipped.push(index);

  if (matchFlipped.length === 2) {
    matchMoves++;
    document.getElementById('match-moves').textContent = matchMoves;
    matchLocked = true;
    const [a, b] = matchFlipped;
    const tA = matchTiles[a];
    const tB = matchTiles[b];
    if (tA.pairId === tB.pairId) {
      document.querySelector(`.match-tile[data-index="${a}"]`).classList.add('matched');
      document.querySelector(`.match-tile[data-index="${b}"]`).classList.add('matched');
      matchMatched++;
      document.getElementById('match-matched').textContent = matchMatched;
      matchFlipped = [];
      matchLocked = false;
      if (matchMatched === game.pairs.length) {
        document.getElementById('match-win').classList.remove('hidden');
        document.getElementById('match-win-msg').textContent = `You finished in ${matchMoves} moves!`;
        document.getElementById('replayMatch').addEventListener('click', () => startMatchGame(game.id));
      }
    } else {
      setTimeout(() => {
        [a, b].forEach(i => {
          const e = document.querySelector(`.match-tile[data-index="${i}"]`);
          e.classList.remove('flipped');
          e.querySelector('.tile-back').classList.remove('hidden');
          e.querySelector('.tile-front').classList.add('hidden');
        });
        matchFlipped = [];
        matchLocked = false;
      }, 700);
    }
  }
}

// ===== Offline / SW =====
function updateOnlineStatus() {
  const b = document.getElementById('offline-banner');
  if (!navigator.onLine) b?.classList.add('show'); else b?.classList.remove('show');
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

let swRegistration = null, refreshing = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    swRegistration = reg;
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          if (navigator.onLine) document.getElementById('update-banner')?.classList.add('show');
          else localStorage.setItem('updateWaiting', 'true');
        }
      });
    });
  }).catch(console.error);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) { refreshing = true; location.reload(); }
  });
}
document.getElementById('refresh-btn')?.addEventListener('click', () => {
  if (swRegistration?.waiting) swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  else location.reload();
});
window.addEventListener('online', () => {
  if (localStorage.getItem('updateWaiting') === 'true') {
    document.getElementById('update-banner')?.classList.add('show');
    localStorage.removeItem('updateWaiting');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await initTheme();
  await loadProgress();
  FLASHCARDS = await loadJSON('./data/flashcards.json');
  QUIZZES = await loadJSON('./data/quizzes.json');
  LABS = await loadJSON('./data/labs.json');
  CHALLENGES = await loadJSON('./data/challenges.json');
  GAMES = await loadJSON('./data/games.json');
  console.log(`Dev Hub ready — ${LABS.length} labs, ${CHALLENGES.length} challenges, ${GAMES.length} games`);
});
