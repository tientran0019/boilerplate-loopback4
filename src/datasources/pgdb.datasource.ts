/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-23 20:57:56

* Last updated on: 2023-10-23 20:57:56
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject, LifeCycleObserver, lifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler, AnyObject } from '@loopback/repository';

const config = {
	name: 'pgdb',
	connector: 'postgresql',
	host: process.env.POSTGRESQL_HOST,
	port: process.env.POSTGRESQL_PORT,
	url: process.env.MONGO_URL,
	user: process.env.POSTGRESQL_USER,
	password: process.env.POSTGRESQL_PASSWORD,
	database: process.env.POSTGRESQL_DATABASE,
};

@lifeCycleObserver('datasource')
export class PostgreSQLDataSource extends juggler.DataSource implements LifeCycleObserver {
	static readonly dataSourceName = config.name;
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.pgdb', { optional: true })
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
