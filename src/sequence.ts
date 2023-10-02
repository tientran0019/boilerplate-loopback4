import { DefaultSequence, ExpressRequestHandler, RequestContext } from '@loopback/rest';

import helmet from 'helmet'; // For security
import morgan from 'morgan'; // For http access logging

const middlewareList: ExpressRequestHandler[] = [
	helmet({
		hsts: {
			// 60 days
			maxAge: 86400,
			// removing the "includeSubDomains" option
			includeSubDomains: false,
		},
		noSniff: false,
		frameguard: {
			action: 'deny',
		},
	}), // options for helmet is fixed and cannot be changed at runtime
	morgan('dev', {}), // options for morgan is fixed and cannot be changed at runtime
];

export class MySequence extends DefaultSequence {
	async handle(context: RequestContext): Promise<void> {
		try {
			const { request, response } = context;
			// `this.invokeMiddleware` is an injected function to invoke a list of
			// Express middleware handler functions
			const finished = await this.invokeMiddleware(context, middlewareList);
			if (finished) {
				// The http response has already been produced by one of the Express
				// middleware. We should not call further actions.
				return;
			}
			const route = this.findRoute(request);
			const args = await this.parseParams(request, route);
			const result = await this.invoke(route, args);

			this.send(response, result);
		} catch (error) {
			this.reject(context, error);
		}
	}
}
