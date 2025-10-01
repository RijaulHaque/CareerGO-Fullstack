// CareerGO/frontend/src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Imports your main application component
import './index.css' // Imports your global CSS with Tailwind directives

// This line renders your main App component into the 'root' element of index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)