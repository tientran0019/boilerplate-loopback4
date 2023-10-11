/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:20

* Last updated on: 2023-10-06 16:21:20
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { belongsTo, model, property } from '@loopback/repository';

import { User } from './user.model';
import { Category } from './category.model';
import { SlugifyEntityMixin } from 'src/extensions/slugify';
import { TimestampEntity } from 'src/extensions/timestamp';

@model({
	settings: {
		limit: 10,
		order: 'publishedDate DESC',
	},
})
export class Article extends SlugifyEntityMixin(TimestampEntity) {
	@property({
		type: 'string',
		id: true,
		// mongodb: { dataType: 'ObjectID' },
		jsonSchema: {
			readOnly: true,
		},
	})
	id: string;

	@property({
		type: 'string',
		required: true,
		index: true,
	})
	title: string;

	@property({
		type: 'string',
		required: true,
	})
	summary: string;

	@property({
		type: 'string',
		required: true,
	})
	content: string;

	@property({
		type: 'string',
		required: true,
	})
	thumbnail: string;

	@property({
		type: 'array',
		itemType: 'string',
		index: true,
		jsonSchema: {
			uniqueItems: true,
		},
	})
	hashtag: string;

	@property({
		type: 'number',
		index: true,
		updateOnly: true,
		jsonSchema: {
			pattern: /^\d{13}$/.source,
			errorMessage: {
				pattern: 'Invalid timestamp',
			},
		},
	})
	protected publishedDate?: number;

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

	@belongsTo(
		() => Category,
		{},
		{
			type: 'string',
			mongodb: { dataType: 'ObjectID' },
		},
	)
	categoryId: string;

	constructor(data?: Partial<Article>) {
		super(data);
	}
}

export interface ArticleRelations {
	// describe navigational properties here
}

export type ArticleWithRelations = Article & ArticleRelations;
