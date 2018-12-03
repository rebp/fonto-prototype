import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));


// serviceWorker.register();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(reg => console.log('Service Worker: Registered (Pages)'))
        .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
  }
