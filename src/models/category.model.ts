/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:20

* Last updated on: 2023-10-06 16:21:20
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, belongsTo, model, property } from '@loopback/repository';

import { TimestampMixin } from 'src/mixins/timestamp.mixin';
import { User } from './user.model';

@model({
	settings: {
		limit: 10,
		order: 'createdAt DESC',
	},
})
export class Category extends TimestampMixin(Entity) {
	@property({
		type: 'string',
		id: true,
		mongodb: { dataType: 'ObjectID' },
		jsonSchema: {
			readOnly: true,
		},
	})
	id: string;

	@property({
		type: 'string',
		required: true,
		index: {
			unique: true,
		},
	})
	name: string;

	@property({
		type: 'string',
	})
	desc: string;

	@property({
		type: 'string',
		default: 'draft',
		jsonSchema: {
			enum: ['draft', 'published', 'archived'],
		},
	})
	state: string;

	@belongsTo(
		() => User,
		{
			keyTo: 'userId',
			name: 'creator',
		},
		{
			type: 'string',
			mongodb: { dataType: 'ObjectID' },
			jsonSchema: {
				readOnly: true,
			},
		},
	)
	creatorId: string;

	constructor(data?: Partial<Category>) {
		super(data);
	}
}

export interface CategoryRelations {
	// describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
