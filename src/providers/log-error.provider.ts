import { Provider } from '@loopback/context';
import { LogError, Request } from '@loopback/rest';
import { inject } from '@loopback/core';
import { LoggerBindings } from 'src/keys';
import { WinstonLoggerService } from 'src/services/logger.service';

export class LogErrorProvider implements Provider<LogError> {
	constructor(@inject(LoggerBindings.LOGGER) protected logger: WinstonLoggerService) { }

	value(): LogError {
		return (err, statusCode, req) => this.action(err, statusCode, req);
	}

	action(err: Error, statusCode: number, req: Request) {
		if (statusCode === 200) {
			return;
		}

		this.logger.logger.error(
			`HTTP ${statusCode} on ${req.method} ${req.url}: ${err.stack ?? err}: ${JSON.stringify(Object.assign({}, req.headers))}`,
		);
	}
}
