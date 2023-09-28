import { Provider } from '@loopback/context';
import { LogError, Request } from '@loopback/rest';
import { inject } from '@loopback/core';

import { LoggerService } from 'src/services/logger.service';
import { LoggerBindings } from 'src/keys';

export class LogErrorProvider implements Provider<LogError> {
	constructor(@inject(LoggerBindings.LOGGER) protected logger: LoggerService) { }

	value(): LogError {
		return (err, statusCode, req) => this.action(err, statusCode, req);
	}

	action(err: Error, statusCode: number, req: Request) {
		this.logger.error(
			`HTTP ${statusCode} on ${req.method} ${req.url}: ${err.stack ?? err}`,
			{
				headers: Object.assign({}, req.headers),
			},
		);
	}
}
