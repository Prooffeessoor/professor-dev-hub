# Professor Dev Hub

Interactive **App Development & Web Design** learning PWA — a modern replica of [Professor Bio Hub](https://prooffeessoor.github.io/professor-bio-hub/).

## Features

- Learning Paths (HTML, CSS, JavaScript, UI/UX, Responsive Design, PWA, React basics, Expo/React Native intro)
- Spaced-repetition Study Cards
- Interactive Quizzes with timer
- Practical Labs & Mini Projects
- Coding Challenges
- Games & Puzzles
- Local Notes (IndexedDB)
- Progress & streak tracking
- Full offline support via Service Worker
- Dark / Light theme
- Installable Progressive Web App
- Background Sync ready (for future cloud sync)

## Tech Stack

- Pure HTML / CSS / JavaScript (no framework)
- IndexedDB for structured offline data
- Service Worker with versioned caching + update detection
- Web App Manifest

## Live Demo

After enabling GitHub Pages (Settings → Pages → Deploy from branch `main` / root):

**https://prooffeessoor.github.io/professor-dev-hub/**

## Local Development

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Project Structure

```
├── index.html
├── manifest.webmanifest
├── sw.js
├── db.js              # IndexedDB wrapper
├── app.js             # Main application logic
├── styles.css
├── data/              # Lessons, quizzes, cards, etc.
└── icons/
```

## License

Educational use. Built for aspiring developers and designers.
