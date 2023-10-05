import { Entity, hasOne, model, property } from '@loopback/repository';
import { UserCredentials } from './user-credentials.model';

@model({
	// name: 'users',
	settings: {
		indexes: {
			uniqueEmail: {
				keys: {
					email: 1,
				},
				options: {
					unique: true,
				},
			},
		},
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

	@property({
		type: 'string',
		required: true,
	})
	email: string;

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
	})
	phone?: string;

	@property({
		type: 'date',
		default: () => new Date(),
	})
	lastLogin?: Date;

	@property({
		type: 'array',
		itemType: 'string',
	})
	roles?: string[];

	@property({
		type: 'string',
	})
	resetKey?: string;

	@property({
		type: 'number',
	})
	resetCount: number;

	@property({
		type: 'string',
	})
	resetTimestamp: string;

	@property({
		type: 'string',
	})
	resetKeyTimestamp: string;

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
