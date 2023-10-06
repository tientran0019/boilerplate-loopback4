/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:15:13

* Last updated on: 2023-10-06 16:15:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { belongsTo, Entity, model, property } from '@loopback/repository';

import { User } from './user.model';

@model({ settings: { strict: false } })
export class RefreshToken extends Entity {
	@property({
		type: 'string',
		id: true,
		generated: false,
	})
	id: string;

	@belongsTo(() => User)
	userId: string;

	// @property({
	// 	type: 'string',
	// 	required: true,
	// })
	// refreshToken: string;

	@property({
		type: 'boolean',
		default: false,
	})
	revoked?: boolean;

	@property({
		type: 'date',
	})
	revokedAt?: Date;

	@property({
		type: 'date',
		default: () => new Date(),
	})
	createdAt?: Date;

	@property({
		type: 'string',
		// required: true,
	})
	ipAddress: string;

	@property({
		type: 'string',
	})
	clientId?: string;

	@property({
		type: 'object',
	})
	userAgent: object;

	// Define well-known properties here

	// Indexer property to allow additional data
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[prop: string]: any;

	constructor(data?: Partial<RefreshToken>) {
		super(data);
	}
}

export interface RefreshTokenRelations {
	// describe navigational properties here
}

export type RefreshTokenWithRelations = RefreshToken & RefreshTokenRelations;
