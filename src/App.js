import React from 'react';
import { Switch, Route } from 'react-router-dom';
import VisualizerPage from './routes/visualizer-page/VisualizerPage';
import PageNotFound from './routes/page-not-found/PageNotFound';

function app() {
	return (
		<Switch>
			<Route path="/" component={VisualizerPage} />
			<Route component={PageNotFound} />
		</Switch>
	);
}

export default app;
