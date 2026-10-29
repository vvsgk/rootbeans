import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export function renderPage(path, entries) {
  return renderToString(<App initialPath={path} initialEntries={entries} />);
}
