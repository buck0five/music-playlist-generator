// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Optional debug line
console.log('>>> main.jsx loaded <<<');

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);

root.render(<App />);
