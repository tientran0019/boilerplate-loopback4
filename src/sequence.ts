import { DefaultSequence, ExpressRequestHandler, FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler } from '@loopback/rest';
import {
	AuthenticateFn,
	AuthenticationBindings,
	AUTHENTICATION_STRATEGY_NOT_FOUND,
	USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';


import helmet from 'helmet'; // For security
import morgan from 'morgan'; // For http access logging
import { inject } from '@loopback/context';

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
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				'img-src': ['\'self\'', 'https: data:'],
				'script-src': ['\'self\'', '\'unsafe-inline\'', 'https: data:'],
			},
			// reportOnly: true,
		},
	}), // options for helmet is fixed and cannot be changed at runtime
	morgan('dev', {}), // options for morgan is fixed and cannot be changed at runtime
];

export class MySequence extends DefaultSequence implements SequenceHandler {
	constructor(
		findRoute: FindRoute,
		parseParams: ParseParams,
		invoke: InvokeMethod,
		send: Send,
		reject: Reject,
		@inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
	) {
		super(findRoute, parseParams, invoke, send, reject);
	}

	/**
	 * Runs the default sequence. Given a handler context (request and response),
	 * running the sequence will produce a response or an error.
	 *
	 * @param context - The request context: HTTP request and response objects,
	 * per-request IoC container and more.
	 */
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

			// - enable jwt auth -
			// call authentication action
			await this.authenticateRequest(request);

			const args = await this.parseParams(request, route);
			const result = await this.invoke(route, args);

			this.send(response, result);
		} catch (error) {
			// if error is coming from the JWT authentication extension
			// make the statusCode 401
			if (
				error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
				error.code === USER_PROFILE_NOT_FOUND
			) {
				Object.assign(error, { statusCode: 401 /* Unauthorized */ });
			}

			this.reject(context, error);
		}
	}
}
