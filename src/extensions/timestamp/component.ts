/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-10 00:06:52

* Last updated on: 2023-10-10 00:06:52
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Component, ProviderMap } from '@loopback/core';

export class TimestampComponent implements Component {
	providers?: ProviderMap = {};

	constructor() {
		// Initialize the providers property in the constructor
		this.providers = {};
	}
}
