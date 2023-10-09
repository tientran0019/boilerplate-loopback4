/* --------------------------------------------------------
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

export function SlugifyEntityMixin<
	T extends Entity,
	S extends Constructor<T> | AbstractConstructor<T>,
>(base: S, config?: Partial<PropertyDefinition>): typeof base & Constructor<IBaseEntity> {
	class SlugifyEntity extends base {
		@property({
			type: 'string',
			index: {
				unique: true,
			},
			jsonSchema: {
				readOnly: true,
				pattern: '/^[a-z0-9]+([a-z0-9_-])*$/',
				errorMessage: {
					pattern: 'Invalid slug',
				},
			},
			...config,
		})
		slug: string;
	}

	return SlugifyEntity;
}
