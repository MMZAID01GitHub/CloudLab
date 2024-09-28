import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
//import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App signOut={function (): void {
      throw new Error('Function not implemented.')
    } } />
  </StrictMode>,
)
