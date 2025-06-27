import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
   <App />
  </AppContextProvider>
  </BrowserRouter>,
)
