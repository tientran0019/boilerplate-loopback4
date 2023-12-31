/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 23:42:27

* Last updated on: 2023-10-06 23:42:27
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import {
	Request,
	ResponseObject,
	RestBindings,
	get,
	response,
} from '@loopback/rest';
import { AUTHENTICATED } from 'src/extensions/authentication-jwt';

import { LoggerBindings, LoggerService } from 'src/extensions/logger';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
	description: 'Ping Response',
	content: {
		'application/json': {
			schema: {
				type: 'object',
				title: 'PingResponse',
				properties: {
					greeting: { type: 'string' },
					date: { type: 'string' },
					url: { type: 'string' },
					ipAddress: { type: 'string' },
					useragent: { type: 'string' },
					clientId: { type: 'string' },
					language: { type: 'string' },
					headers: {
						type: 'object',
						properties: {
							'Content-Type': { type: 'string' },
						},
						additionalProperties: true,
					},
				},
			},
		},
	},
};

/**
 * A simple controller to bounce back http requests
 */
// @authenticate('jwt')
export class PingController {
	constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

	// Inject a winston logger
	@inject(LoggerBindings.LOGGER)
	protected logger: LoggerService;

	// Map to `GET /ping`
	@get('/ping')
	@authenticate('jwt')
	// @authorize({ allowedRoles: [AUTHENTICATED], deniedRoles: [] })
	@response(200, PING_RESPONSE)
	ping(): object {
		this.logger.log('info', 'greeting');
		const language: string = this.req.acceptsLanguages(['en', 'zh']) || 'en';
		// Reply with a greeting, the current time, the url, and request headers
		return {
			greeting: 'Hello from LoopBack ',
			date: new Date(),
			url: this.req.url,
			headers: Object.assign({}, this.req.headers),
			useragent: this.req.get('user-agent'),
			clientId: this.req.get('x-client-id'),
			ipAddress: this.req.ip,
			language,
		};
	}
}
