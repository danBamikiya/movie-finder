'use strict';

module.exports = function createNoopServiceWorkerMiddleware(servedPath) {
	return (req, res, next) => {
		if (req.url === path.join(servedPath, 'service-worker.js')) {
			res.setHeader('Content-Type', 'text/javascript');
			res.send(
				`
        self.addEventListener('activate', () => self.skipWaiting());

        self.addEventListener('activate', () => {
          self.clients.matchAll({ type: 'window' }).then(windowClients => {
            for (let windowClient of windowClients) {
              // Force open pages to refresh, so that they have a chance to load the
              // fresh navigation response from the local dev server.
              windowClient.navigate(windowClient.url);
            }
          });
        });
        `
			);
		} else {
			next();
		}
	};
};
