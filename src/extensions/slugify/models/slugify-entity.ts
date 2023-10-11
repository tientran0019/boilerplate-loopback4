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
 * Abstract base class for all slugify enabled models
 *
 * @description
 * Base class for all slugify enabled models created.
 * It adds three attributes to the model class for handling slugify,
 * namely, 'slug'
 * Its an abstract class so no repository class should be based on this.
 */
export abstract class SlugifyEntity extends Entity {
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
	})
	slug: string;

	constructor(data?: Partial<SlugifyEntity>) {
		super(data);
	}
}
