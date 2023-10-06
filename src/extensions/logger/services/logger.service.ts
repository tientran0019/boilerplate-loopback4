/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 15:24:08

* Last updated on: 2023-10-06 15:24:08
* Last updated by: Tien Tran
*------------------------------------------------------- */

import winston, { Logger, QueryOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import appRoot from 'app-root-path';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __DEV__ = process.env.NODE_ENV !== 'production';

const combineFilter = winston.format((info, opts) => {
	return info.level !== 'error' ? info : false;
});

const errorFilter = winston.format((info, opts) => {
	return info.level === 'error' ? info : false;
});

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
};
winston.addColors(colors);

export class LoggerService {
	private logger: winston.Logger = winston.createLogger({
		exceptionHandlers: [
			new DailyRotateFile({
				filename: `${appRoot}/logs/exceptions-%DATE%.log`,
				datePattern: 'YYYY-MM-DD',
				zippedArchive: false,
				maxSize: '20m',
				maxFiles: '14d',
				json: true,
				format: winston.format.combine(
					errorFilter(),
					winston.format.timestamp({
						format: 'YYYY-MM-DD HH:mm:ss',
					}),
					winston.format.uncolorize(),
					winston.format.json(),
				),
				watchLog: true,
			}),
		],
		exitOnError: false,
		// Default format
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
		),
		transports:
			__DEV__ ? [
				new winston.transports.Console({
					handleExceptions: true,
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.timestamp({
							format: 'YYYY-MM-DD HH:mm:ss',
						}),
						winston.format.json(),
						winston.format.prettyPrint(),
						winston.format.printf((log) => {
							const { timestamp, level, message, headers } = log;

							const meta = {
								headers,
							};

							if (headers && meta && Object.keys(meta).length > 0) {
								console.log('Metadata:', meta);
							}
							return `[${timestamp}] [${level}] [${message}]`;
						}),
					),
				}),
			] : [
				new DailyRotateFile({
					filename: appRoot + '/logs/errors-%DATE%.log',
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: true,
					maxSize: '20m',
					maxFiles: '14d',
					json: true,
					format: winston.format.combine(
						errorFilter(),
						winston.format.timestamp({
							format: 'YYYY-MM-DD HH:mm:ss',
						}),
						winston.format.uncolorize(),
						winston.format.json(),
					),
					watchLog: true,
				}),
				new DailyRotateFile({
					filename: appRoot + '/logs/combine-%DATE%.log',
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: true,
					maxSize: '20m',
					maxFiles: '14d',
					json: true,
					format: winston.format.combine(
						combineFilter(),
						winston.format.timestamp({
							format: 'YYYY-MM-DD HH:mm:ss',
						}),
						winston.format.uncolorize(),
						winston.format.json(),
						// winston.format.printf((info) => {
						// 	info.message = (info.message as string).trim();
						// 	return JSON.stringify(info);
						// }),
					),
					watchLog: true,
				}),
			],
	});

	log = (level: string, message: string, meta?: object): Logger => {
		return this.logger.log(level, message, meta);
	};
	// for cli and npm levels
	error = (message: string, meta?: object): Logger => {
		return this.logger.error(message, meta);
	};
	warn = (message: string, meta?: object): Logger => {
		return this.logger.warn(message, meta);
	};
	info = (message: string, meta?: object): Logger => {
		return this.logger.info(message, meta);
	};
	debug = (message: string, meta?: object): Logger => {
		return this.logger.debug(message, meta);
	};
	http = (message: string, meta?: object): Logger => {
		return this.logger.http(message, meta);
	};

	// TODO: Build the UI to see the logs
	query = (options?: QueryOptions, callback?: (err: Error, results: any) => void): any => {
		return this.logger.query(options, callback);
	};
}
