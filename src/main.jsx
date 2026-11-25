import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.addEventListener('error', (e) => {
  const el = document.getElementById('root');
  if (el && (!el.children.length || el.innerHTML === '')) {
    el.innerHTML = `<div style="padding:20px;color:red;font-family:sans-serif">
      <h3>Global Runtime Error:</h3>
      <pre style="background:#eee;padding:10px">${e.message}\n${e.filename}:${e.lineno}</pre>
    </div>`;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
