# grogger

This repository now includes:

1. The original `grogger.py` Pygame game.
2. A real-time collaborative Markdown editor with live preview and version history.

## Collaborative Markdown editor

### Stack
- **Frontend:** React + Vite, `react-markdown`, `rehype-sanitize`.
- **Backend:** Node.js + Express + Socket.io.
- **Testing:** Vitest + Testing Library.

### Install
```bash
npm install
```

### Run the editor (frontend + backend)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- WebSocket/HTTP server: `http://localhost:3001`

### Run tests
```bash
npm test
```

## Original game (still available)

### Requirements
- Python 3.11+
- [Pygame](https://www.pygame.org/) library

Install the requirements with:
```bash
pip install -r requirements.txt
```

### Running the game
```bash
python grogger.py
```
Use the arrow keys to move the frog. Avoid cars and collect the blue grogs.
Each grog collected makes the screen fuzzier.
