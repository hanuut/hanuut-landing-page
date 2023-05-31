import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import "./i18n"
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <>
    <Router>
    <App />
  </Router>
  </>
);


