/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-08 21:34:08

* Last updated on: 2023-10-08 21:34:08
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { MixinTarget, Constructor } from '@loopback/core';
import { Model, model, property } from '@loopback/repository';

// Define the mixin class
export function TimestampMixin<T extends MixinTarget<Constructor<Model>>>(superClass: T) {
	// Add a timestamp property
	@model()
	class TimestampMixinClass extends superClass {
		@property({
			type: 'number',
			default: () => +new Date(),
			jsonSchema: {
				readOnly: true,
				pattern: '\\d{13}',
				errorMessage: {
					pattern: 'Invalid phone timestamp',
				},
			},
		})
		readonly createdAt: number;

		@property({
			type: 'number',
			default: () => +new Date(),
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: '\\d{13}',
				errorMessage: {
					pattern: 'Invalid phone timestamp',
				},
			},
		})
		readonly updatedAt: number;

		constructor(...args: any[]) {
			super(...args);
			this.updatedAt = +new Date();
		}
	}

	return TimestampMixinClass;
}
