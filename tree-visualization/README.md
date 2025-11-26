# BST & AVL Tree Visualization

An interactive React + Vite visualization tool for Binary Search Trees (BST) and AVL Trees.

## Features

- **Two modes:** Switch between BST and AVL tree implementations
- **Interactive insertion:** Add nodes and watch them being placed with animations
- **Rotation visualization:** See AVL rotations (LL, RR, LR, RL) in action
- **Balance factor display:** Shows BF for each node in AVL mode
- **Quick insert buttons:** Pre-defined sequences to demonstrate rotation cases
- **Operation log:** Track all insertions and rotations
- **Animated transitions:** Smooth animations using Framer Motion

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project Structure

```
tree-visualization/
├── public/
│   └── tree.svg          # Favicon
├── src/
│   ├── components/
│   │   ├── Controls.jsx   # Mode selector, input, quick insert
│   │   ├── TreeCanvas.jsx # SVG tree rendering
│   │   └── InfoPanel.jsx  # Stats, logs, legend
│   ├── lib/
│   │   ├── bst.js        # BST implementation
│   │   └── avl.js        # AVL tree implementation
│   ├── App.jsx           # Main app component
│   ├── App.css
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

