
import { inject, lifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler, AnyObject } from '@loopback/repository';

const config = {
	name: 'redis',
	connector: 'kv-redis',
	url: process.env.REDIS_URL,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	user: process.env.REDIS_USER,
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
