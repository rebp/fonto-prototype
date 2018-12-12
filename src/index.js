import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import Routes from './routes'

const App = () => {
    return(
        <BrowserRouter>
            <Routes/>
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
	const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

	navigator.serviceWorker.register(swUrl).then(function (reg) {
		console.log("SW registration succeeded. Scope is " + reg.scope);
	}).catch(function (err) {
		console.error("SW registration failed with error " + err);
	});
}
