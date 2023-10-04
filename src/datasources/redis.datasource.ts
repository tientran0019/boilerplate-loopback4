
import { inject, lifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler, AnyObject } from '@loopback/repository';

const config = {
	name: 'redis',
	connector: 'kv-redis',
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
	db: process.env.REDIS_DATABASE,
};

@lifeCycleObserver('datasource')
export class RedisDataSource extends juggler.DataSource {
	static readonly dataSourceName = config.name;
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.redis', { optional: true })
		dsConfig: AnyObject = config,
	) {
		Object.assign(dsConfig, {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			password: process.env.REDIS_PASSWORD,
			db: process.env.REDIS_DATABASE,
		});

		super(dsConfig);
	}

	/**
	 * Disconnect the datasource when application is stopped. This allows the
	 * application to be shut down gracefully.
	 */
	stop(): ValueOrPromise<void> {
		return super.disconnect();
	}
}
