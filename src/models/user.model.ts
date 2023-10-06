/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:20

* Last updated on: 2023-10-06 16:21:20
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, hasOne, model, property } from '@loopback/repository';
import { UserCredentials } from './user-credentials.model';
import { UserRoles, UserStatus } from 'src/constants';

@model({
	name: 'users',
	// jsonSchema: {
	// 	uniqueItems: true,
	// },
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
export class User extends Entity {
	@property({
		type: 'string',
		id: true,
		mongodb: { dataType: 'ObjectID' },
	})
	id: string;

	@property({
		type: 'string',
		required: true,
	})
	fullName: string;

	// must keep it
	@property({
		type: 'string',
		index: true,
		jsonSchema: {
			transform: ['toLowerCase'],
		},
	})
	username: string;

	@property({
		type: 'string',
		required: true,
		index: true,
		jsonSchema: {
			format: 'email',
			transform: ['toLowerCase'],
		},
	})
	readonly email: string;

	@property({
		type: 'boolean',
	})
	emailVerified?: boolean;

	@property({
		type: 'string',
	})
	verificationToken?: string;

	@property({
		type: 'string',
		index: true,
	})
	phone?: string;

	@property({
		type: 'date',
		// defaultFn: 'now',
		jsonSchema: {
			readOnly: true,
		},
	})
	readonly lastLogin?: Date;

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
