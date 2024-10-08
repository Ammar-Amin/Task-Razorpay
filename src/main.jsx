import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import StatusProvider from './context/StatusContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StatusProvider>
      <App />
    </StatusProvider>
  </StrictMode>,
)
