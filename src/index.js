import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import "./i18n"
import App from './App';
import ReactGA from "react-ga4";


const root = ReactDOM.createRoot(document.getElementById('root'));
//Initialize GA4
ReactGA.initialize("G-0L74N7HN51");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
});

root.render(
  <>
    <Router>
    <App />
  </Router>
  </>
);


