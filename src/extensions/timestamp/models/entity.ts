/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:35:47

* Last updated on: 2023-10-09 22:35:47
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, property } from '@loopback/repository';

/**
 * Abstract base class for all Timestamp enabled models
 *
 * @description
 * Base class for all Timestamp enabled models created.
 * It adds three attributes to the model class for handling Timestamp,
 * namely, 'createdAt', 'updatedAt'
 * Its an abstract class so no repository class should be based on this.
 */
export abstract class TimestampEntity extends Entity {
	@property({
		type: 'number',
		default: () => +new Date(),
		index: true,
		jsonSchema: {
			readOnly: true,
			pattern: '/^\d{13}$/',
			errorMessage: {
				pattern: 'Invalid timestamp',
			},
		},
	})
	readonly createdAt: number;

	@property({
		type: 'number',
		index: true,
		updateOnly: true, // Update only when the model is updated
		jsonSchema: {
			readOnly: true,
			pattern: '/^\d{13}$/',
			errorMessage: {
				pattern: 'Invalid timestamp',
			},
		},
	})
	readonly updatedAt: number;

	constructor(data?: Partial<TimestampEntity>) {
		super(data);
	}
}
