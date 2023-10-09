/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 09:56:36

* Last updated on: 2023-10-09 09:56:36
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Model, model, property } from '@loopback/repository';
import { MixinTarget, Constructor } from '@loopback/core';

export function FindBySlugModelMixin<T extends MixinTarget<Constructor<Model>>>(
	superClass: T,
) {
	@model()
	class FindBySlugModelMixinClass extends superClass {
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
	}

	return FindBySlugModelMixinClass;
}
