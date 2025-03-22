import './patch-local-storage-for-github-pages';
import './polyfills';
import eruda from "eruda";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'

eruda.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
