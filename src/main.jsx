import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/home.css';
import './styles/journey.css';
import './styles/journal.css';
// Load global.css last so its responsive and reduced-motion rules win at each breakpoint.
import './styles/global.css';

hydrateRoot(document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
