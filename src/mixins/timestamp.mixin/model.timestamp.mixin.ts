/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-08 21:34:08

* Last updated on: 2023-10-08 21:34:08
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { MixinTarget, Constructor } from '@loopback/core';
import { Model, PropertyDefinition, model, property } from '@loopback/repository';

export interface TimestampMixinOptions {
	index?: {
		createdAt?: object | boolean,
		updatedAt?: object | boolean,
	};
	createdAt?: Partial<PropertyDefinition>;
	updatedAt?: Partial<PropertyDefinition>;
}

// Define the mixin class
export function TimestampMixin<T extends MixinTarget<Constructor<Model>>>(superClass: T, options: TimestampMixinOptions = { index: { createdAt: true, updatedAt: true } }) {
	// Add a timestamp property
	@model()
	class TimestampMixinClass extends superClass {
		@property({
			type: 'number',
			// default: () => +new Date(),
			index: options.index?.createdAt,
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...(options?.createdAt ?? {}),
		})
		readonly createdAt: number;

		@property({
			type: 'number',
			// default: () => +new Date(),
			index: options.index?.updatedAt,
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...(options?.updatedAt ?? {}),
		})
		readonly updatedAt: number;

		constructor(...args: any[]) {
			super(...args);
			// this.updatedAt = +new Date();
		}
	}

	return TimestampMixinClass;
}
