import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

export interface LoggerService {
	logger: object;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const __DEV__ = process.env.NODE_ENV !== 'production';

export class WinstonLoggerService implements LoggerService {
	logger: winston.Logger = winston.createLogger({
		level: 'error',
		// format của log được kết hợp thông qua format.combine
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json(),
			winston.format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			winston.format.prettyPrint(),
			winston.format.printf((log) => {
				// nếu log là error hiển thị stack trace còn không hiển thị message của log
				if (log.stack) return `[${log.timestamp}] [${log.level}] [${log.label}] ${log.stack}`;
				return `[${log.timestamp}] [${log.level}] [${log.label}] ${log.message}`;
			}),
		),
		transports: [
			__DEV__ ? new winston.transports.Console() : new DailyRotateFile({
				filename: path.join(__dirname, '../../logs/error/errors-%DATE%.log'),
				datePattern: 'YYYY-MM-DD-HH',
				zippedArchive: true,
				maxSize: '20m',
				maxFiles: '14d',
			}),
		],
	});
}
