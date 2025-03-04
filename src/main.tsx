
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Application starting...");

const container = document.getElementById("root");
if (!container) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(container);
  console.log("Root element found, rendering app");
  root.render(<App />);
}
