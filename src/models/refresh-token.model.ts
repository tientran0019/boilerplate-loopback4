/** --------------------------------------------------------
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
import { TimestampEntityMixin } from 'src/extensions/timestamp';

@model({ settings: { strict: false } })
export class RefreshToken extends TimestampEntityMixin(Entity) {
	@property({
		type: 'string',
		id: true,
		generated: false,
		index: {
			type: 'hashed',
		},
	})
	id: string;

	@belongsTo(() => User, {}, {
		mongodb: { dataType: 'ObjectID' },
	})
	userId: string;

	// TODO add current token to can be revoked it in the future, when blocking the user or remotely logout
	@property({
		type: 'string',
	})
	currentToken?: string;

	@property({
		type: 'boolean',
		default: false,
	})
	revoked?: boolean;

	@property({
		type: 'number',
	})
	revokedAt?: number;

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
		type: 'string',
	})
	userAgent: string;

	@property({
		type: 'string',
	})
	address?: string;

	@property({
		type: 'GeoPoint',
	})
	location?: object;

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
