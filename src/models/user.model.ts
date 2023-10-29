/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:20

* Last updated on: 2023-10-06 16:21:20
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, hasOne, model, property } from '@loopback/repository';
import { UserRoles, UserStatus } from 'src/constants';
import { UserCredentials } from './user-credentials.model';
import { TimestampEntityMixin } from 'src/extensions/timestamp';

@model({
	// name: 'Users',
	settings: {
		limit: 10,
		// where: { deleted: false },
		// indexes: {
		// 	uniqueEmail: {
		// 		keys: {
		// 			email: 1,
		// 		},
		// 		options: {
		// 			unique: true,
		// 		},
		// 	},
		// },
	},
})
export class User extends TimestampEntityMixin(Entity) {
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
	})
	fullName: string;

	@property({
		type: 'string',
		required: true,
		index: {
			unique: true,
		},
		jsonSchema: {
			format: 'email',
			transform: ['toLowerCase'],
		},
	})
	readonly email: string;

	@property({
		type: 'string',
		index: {
			unique: true,
		},
		jsonSchema: {
			transform: ['toLowerCase'],
			readOnly: true,
		},
	})
	readonly username: string;

	@property({
		type: 'boolean',
		jsonSchema: {
			readOnly: true,
		},
	})
	readonly emailVerified?: boolean;

	@property({
		type: 'string',
		jsonSchema: {
			readOnly: true,
		},
	})
	readonly verificationToken?: string;

	@property({
		type: 'string',
		index: {
			sparse: true,
		},
	})
	phone?: string;

	@property({
		type: 'string',
	})
	country?: string;

	@property({
		type: 'number',
		// defaultFn: 'now',
		jsonSchema: {
			readOnly: true,
		},
	})
	lastLogin?: number;

	@property({
		type: 'string',
		default: 'customer',
		// hidden: true,
		jsonSchema: {
			enum: Object.values(UserRoles),
			readOnly: true,
		},
	})
	readonly role: string;

	@property({
		type: 'string',
		default: 'active',
		jsonSchema: {
			enum: Object.values(UserStatus),
			readOnly: true,
		},
	})
	readonly status: string;


	@hasOne(() => UserCredentials, { keyTo: 'userId' })
	userCredentials: UserCredentials;

	constructor(data?: Partial<User>) {
		super(data);
	}
}

export interface UserRelations {
	// describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
