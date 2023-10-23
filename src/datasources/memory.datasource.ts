/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-23 22:32:02

* Last updated on: 2023-10-23 22:32:02
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
	name: 'memory',
	connector: 'kv-memory',
	file: './data/kv-db.json',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MemoryDataSource extends juggler.DataSource implements LifeCycleObserver {
	static readonly dataSourceName = config.name;
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.memory', { optional: true })
		dsConfig: object = config,
	) {
		super(dsConfig);
	}
}
