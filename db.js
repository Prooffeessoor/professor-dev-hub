/* Professor Dev Hub - IndexedDB Wrapper
   Progress, notes, quiz results, and flashcard SRS state
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

      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        notesStore.createIndex('createdAt', 'createdAt', { unique: false });
        notesStore.createIndex('title', 'title', { unique: false });
      }

      if (!db.objectStoreNames.contains('quizResults')) {
        const quizStore = db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('topic', 'topic', { unique: false });
        quizStore.createIndex('date', 'date', { unique: false });
      }

      // SRS state for each flashcard
      if (!db.objectStoreNames.contains('flashcards')) {
        const cardStore = db.createObjectStore('flashcards', { keyPath: 'id' });
        cardStore.createIndex('nextReview', 'nextReview', { unique: false });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });

  return dbPromise;
}

async function get(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(storeName, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const request = tx.objectStore(storeName).put(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const request = tx.objectStore(storeName).delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

const DevHubDB = {
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

  async getNotes() { return getAll('notes'); },

  async saveNote(note) {
    if (!note.createdAt) note.createdAt = Date.now();
    note.updatedAt = Date.now();
    return put('notes', note);
  },

  async deleteNote(id) { return remove('notes', id); },

  async saveQuizResult(result) {
    result.date = Date.now();
    return put('quizResults', result);
  },

  async getQuizResults() { return getAll('quizResults'); },

  // ===== Spaced Repetition (SRS) =====
  async getCardSRS(cardId) {
    const existing = await get('flashcards', cardId);
    if (existing) return existing;

    // Default new card state
    return {
      id: cardId,
      easeFactor: 2.5,
      interval: 0,          // days
      repetitions: 0,
      nextReview: Date.now(), // due immediately
      lastReviewed: null
    };
  },

  async saveCardSRS(srsData) {
    return put('flashcards', srsData);
  },

  async getAllCardSRS() {
    return getAll('flashcards');
  },

  async getSetting(key) {
    const item = await get('settings', key);
    return item ? item.value : null;
  },

  async setSetting(key, value) {
    return put('settings', { key, value });
  }
};

window.DevHubDB = DevHubDB;
