/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-08 16:28:52

* Last updated on: 2023-10-08 16:28:52
* Last updated by: Tien Tran
*------------------------------------------------------- */

// HOW TO USE
// add to controller
// constructor(
// 	@inject('services.Geocoder') protected geoService: Geocoder,
// ) { }

// const geo = await this.geoService.geocode(address);

// // ignoring because if the service is down, the following section will
// // not be covered
// /* istanbul ignore next */
// if (!geo[0]) {
// 	// address not found
// 	throw new HttpErrors.BadRequest(`Address not found: ${address}`);
// }
// // Encode the coordinates as "lat,lng" (Google Maps API format). See also
// // https://stackoverflow.com/q/7309121/69868
// // https://gis.stackexchange.com/q/7379

import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { GeocoderDataSource } from 'src/datasources/geocoder.datasource';

export interface GeoPoint {
	/**
	 * latitude
	 */
	y: number;

	/**
	 * longitude
	 */
	x: number;
}

export interface Geocoder {
	geocode(address: string): Promise<GeoPoint[]>;
}

export class GeocoderProvider implements Provider<Geocoder> {
	constructor(
		// geocoder must match the name property in the datasource json file
		@inject('datasources.geocoder')
		protected dataSource: GeocoderDataSource = new GeocoderDataSource(),
	) { }

	value(): Promise<Geocoder> {
		return getService(this.dataSource);
	}
}

