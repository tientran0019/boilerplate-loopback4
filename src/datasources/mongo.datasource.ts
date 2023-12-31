/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-23 20:58:05

* Last updated on: 2023-10-23 20:58:05
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject, LifeCycleObserver, lifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler, AnyObject } from '@loopback/repository';

const config = {
	name: 'mongo',
	connector: 'mongodb',
	url: process.env.MONGO_URL,
	host: process.env.MONGO_HOST,
	port: process.env.MONGO_PORT,
	user: process.env.MONGO_USER,
	password: process.env.MONGO_PASSWORD,
	database: process.env.MONGO_DATABASE,
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource implements LifeCycleObserver {
	static readonly dataSourceName = config.name;
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.mongo', { optional: true })
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
