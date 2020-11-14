import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/others/ErrorBoundary';
import { BACKGROUND_COLOR } from './constants/index';

const GlobalStyle = createGlobalStyle`
	body {
		background-color: ${BACKGROUND_COLOR};
		font-family: Arial, Helvetica, sans-serif;
		margin: 0;
	}

	button:focus {
		outline: 0;
	}
`;

ReactDOM.render(
	<div>
		<GlobalStyle />
		<ErrorBoundary>
			<BrowserRouter>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</BrowserRouter>
		</ErrorBoundary>
	</div>,
	document.getElementById('root')
);

serviceWorker.unregister();