import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'virtual:svg-icons-register'
// import ids from 'virtual:svg-icons-names' // 打印图标id
// console.log(ids);
import './main.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
