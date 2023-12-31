/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-08 16:32:58

* Last updated on: 2023-10-08 16:32:58
* Last updated by: Tien Tran
*------------------------------------------------------- */


import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
	name: 'geocoder',
	connector: 'rest',
	options: {
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		timeout: 15000,
	},
	operations: [
		{
			template: {
				method: 'GET',
				url: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
				query: {
					format: '{format=json}',
					benchmark: 'Public_AR_Current',
					address: '{address}',
				},
				responsePath: '$.result.addressMatches[*].coordinates',
			},
			functions: {
				geocode: ['address'],
			},
		},
	],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class GeocoderDataSource extends juggler.DataSource implements LifeCycleObserver {
	static dataSourceName = config.name;
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.geocoder', { optional: true })
		dsConfig: object = config,
	) {
		super(dsConfig);
	}
}
