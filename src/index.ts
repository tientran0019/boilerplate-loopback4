import { ApplicationConfig, BoilerplateLoopback4Application } from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
	const app = new BoilerplateLoopback4Application(options);

	await app.boot();
	await app.start();

	const url = app.restServer.url; // serverOptions
	console.log(`Server is running at ${url}`);
	console.log(`Try ${url}/ping`);

	return app;
}

if (require.main === module) {
	// Run the application
	const config = {
		rest: {
			basePath: '/api/v1',
			router: {
				strict: true,
			},
			port: +(process.env.PORT ?? 3000),
			host: process.env.HOST ?? 'localhost',
			// The `gracePeriodForClose` provides a graceful close for http/https
			// servers with keep-alive clients. The default value is `Infinity`
			// (don't force-close). If you want to immediately destroy all sockets
			// upon stop, set its value to `0`.
			// See https://www.npmjs.com/package/stoppable
			gracePeriodForClose: 5000, // 5 seconds
			openApiSpec: {
				disabled: false,
				// useful when used with OpenAPI-to-GraphQL to locate your application
				setServersFromRequest: true,
			},
			cors: {
				origin: process.env.CORS_DOMAIN ? process.env.CORS_DOMAIN.split(',') : '*',
				methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
				preflightContinue: false,
				optionsSuccessStatus: 204,
				maxAge: 86400,
				credentials: true,
			},
			requestBodyParser: {
				json: {
					strict: true,
					limit: '100kb',
				},
				urlencoded: {
					extended: true,
					limit: '100kb',
				},
			},
		},
	};
	main(config).catch(err => {
		console.error('Cannot start the application.', err);
		process.exit(1);
	});
}
