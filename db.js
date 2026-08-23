/* Professor Dev Hub - IndexedDB Wrapper
   Handles progress, notes, quiz history, and flashcard SRS data
*/

const DB_NAME = 'ProfessorDevHub';
const DB_VERSION = 1;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        notesStore.createIndex('createdAt', 'createdAt', { unique: false });
        notesStore.createIndex('title', 'title', { unique: false });
      }

      // Quiz results
      if (!db.objectStoreNames.contains('quizResults')) {
        const quizStore = db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('topic', 'topic', { unique: false });
        quizStore.createIndex('date', 'date', { unique: false });
      }

      // Flashcard SRS state
      if (!db.objectStoreNames.contains('flashcards')) {
        const cardStore = db.createObjectStore('flashcards', { keyPath: 'id' });
        cardStore.createIndex('nextReview', 'nextReview', { unique: false });
      }

      // Settings / meta
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });

  return dbPromise;
}

// Generic helpers
async function get(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(storeName, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Public API
const DevHubDB = {
  // Progress
  async getProgress() {
    return (await get('progress', 'main')) || {
      id: 'main',
      chaptersCompleted: 0,
      quizzesTaken: 0,
      cardsSeen: 0,
      streak: 0,
      lastActive: null,
      updatedAt: Date.now()
    };
  },

  async saveProgress(data) {
    data.id = 'main';
    data.updatedAt = Date.now();
    return put('progress', data);
  },

  // Notes
  async getNotes() {
    return getAll('notes');
  },

  async saveNote(note) {
    if (!note.createdAt) note.createdAt = Date.now();
    note.updatedAt = Date.now();
    return put('notes', note);
  },

  async deleteNote(id) {
    return remove('notes', id);
  },

  // Quiz results
  async saveQuizResult(result) {
    result.date = Date.now();
    return put('quizResults', result);
  },

  async getQuizResults() {
    return getAll('quizResults');
  },

  // Settings
  async getSetting(key) {
    const item = await get('settings', key);
    return item ? item.value : null;
  },

  async setSetting(key, value) {
    return put('settings', { key, value });
  }
};

// Make available globally
window.DevHubDB = DevHubDB;
