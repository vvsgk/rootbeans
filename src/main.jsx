import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/home.css';
import './styles/journey.css';
import './styles/journal.css';
// Load global.css last so its responsive and reduced-motion rules win at each breakpoint.
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
