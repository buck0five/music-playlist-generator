// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log(">>> main.jsx is running <<<"); // debug line

const rootEl = document.getElementById('root');
console.log("rootEl?", rootEl); // see if it's null or not

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
} else {
  console.warn("No #root element found!");
}
