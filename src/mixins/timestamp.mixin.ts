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
import { Model, PropertyDefinition, property } from '@loopback/repository';

export interface TimestampMixinConfig {
	index?: {
		createdAt?: object | boolean,
		updatedAt?: object | boolean,
	};
	createdAt?: Partial<PropertyDefinition>;
	updatedAt?: Partial<PropertyDefinition>;
}

// Define the mixin class
export function TimestampMixin<T extends MixinTarget<Constructor<Model>>>(superClass: T, config: TimestampMixinConfig = { index: { createdAt: true, updatedAt: true } }) {
	// Add a timestamp property
	class TimestampMixinClass extends superClass {
		@property({
			type: 'number',
			default: () => +new Date(),
			index: config.index?.createdAt,
			jsonSchema: {
				readOnly: true,
				pattern: '\\d{13}',
				errorMessage: {
					pattern: 'Invalid phone timestamp',
				},
			},
			...(config?.createdAt ?? {}),
		})
		readonly createdAt: number;

		@property({
			type: 'number',
			default: () => +new Date(),
			index: config.index?.createdAt,
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: '\\d{13}',
				errorMessage: {
					pattern: 'Invalid phone timestamp',
				},
			},
			...(config?.createdAt ?? {}),
		})
		readonly updatedAt: number;

		constructor(...args: any[]) {
			super(...args);
			this.updatedAt = +new Date();
		}
	}

	return TimestampMixinClass;
}
