/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:40:41

* Last updated on: 2023-10-09 22:40:41
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Constructor } from '@loopback/context';
import { Model, PropertyDefinition, property } from '@loopback/repository';
import { MixinTarget } from '@loopback/core';

export interface TimestampEntityMixinConfigs {
	index?: {
		createdAt?: object | boolean,
		updatedAt?: object | boolean,
	};
	createdAt?: Partial<PropertyDefinition>;
	updatedAt?: Partial<PropertyDefinition>;
}

export function TimestampEntityMixin<T extends MixinTarget<Constructor<Model>>>(
	base: T,
	configs: TimestampEntityMixinConfigs = { index: { createdAt: true, updatedAt: true } },
) {

	class TimestampEntity extends base {
		@property({
			type: 'number',
			default: () => +new Date(),
			index: configs.index?.createdAt,
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...(configs?.createdAt ?? {}),
		})
		readonly createdAt?: number;

		@property({
			type: 'number',
			index: configs.index?.updatedAt,
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...(configs?.updatedAt ?? {}),
		})
		readonly updatedAt?: number;
	}

	return TimestampEntity;
}
