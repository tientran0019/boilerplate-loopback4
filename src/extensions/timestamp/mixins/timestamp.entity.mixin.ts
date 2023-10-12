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
import { Entity, PropertyDefinition, property } from '@loopback/repository';
import { AbstractConstructor, IBaseEntity } from '../types';

export interface TimestampEntityMixinConfigs {
	createdAt?: Partial<PropertyDefinition>
	updatedAt?: Partial<PropertyDefinition>
}

export function TimestampEntityMixin<
	T extends Entity,
	S extends Constructor<T> | AbstractConstructor<T>,
>(base: S, config?: TimestampEntityMixinConfigs): typeof base & Constructor<IBaseEntity> {
	class TimestampEntity extends base {
		@property({
			type: 'number',
			default: () => +new Date(),
			index: true,
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...config?.createdAt,
		})
		readonly createdAt: number;

		@property({
			type: 'number',
			index: true,
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
			...config?.updatedAt,
		})
		readonly updatedAt: number;
	}

	return TimestampEntity;
}
