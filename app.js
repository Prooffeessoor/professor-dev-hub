/* Professor Dev Hub - Main Application Logic */

// ========== Navigation ==========
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link, .bottom-nav-item, .feature-card').forEach(el => {
    el.classList.remove('active');
  });

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(el => el.classList.add('active'));

  // Close sidebar on mobile
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', () => showPage(el.dataset.page));
});

// Sidebar toggle
document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
});

document.getElementById('closeSidebar')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
});

document.getElementById('overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
});

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

  const total = 20; // placeholder total items
  const completed = (progress.chaptersCompleted || 0) + (progress.quizzesTaken || 0);
  const percent = Math.min(100, Math.round((completed / total) * 100));
  document.getElementById('overall-fill').style.width = percent + '%';
  document.getElementById('percent-complete').textContent = percent + '% complete';
  document.getElementById('streak-badge').textContent = `🔥 ${progress.streak || 0} day streak`;
}

// ========== Offline + Update Detection ==========
function updateOnlineStatus() {
  const offlineBanner = document.getElementById('offline-banner');
  if (!navigator.onLine) {
    offlineBanner?.classList.add('show');
  } else {
    offlineBanner?.classList.remove('show');
  }
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
            if (navigator.onLine) {
              document.getElementById('update-banner')?.classList.add('show');
            } else {
              localStorage.setItem('updateWaiting', 'true');
            }
          }
        });
      });
    })
    .catch(console.error);

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

document.getElementById('refresh-btn')?.addEventListener('click', () => {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
});

// Check for waiting update when coming back online
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
  console.log('Professor Dev Hub ready 🚀');
});
