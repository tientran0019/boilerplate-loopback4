/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:10

* Last updated on: 2023-10-06 16:21:10
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, model, property } from '@loopback/repository';

@model()
export class UserCredentials extends Entity {
	@property({
		type: 'string',
		id: true,
		mongodb: { dataType: 'ObjectID' },
	})
	id: string;

	@property({
		type: 'string',
		required: true,
		jsonSchema: {
			minLength: 8,
			maxLength: 30,
			errorMessage: {
				// Corresponding error messages
				minLength: 'Password should be at least 8 characters.',
				maxLength: 'Password should not exceed 30 characters.',
			},
		},
	})
	password: string;

	@property({
		type: 'string',
		required: true,
		mongodb: { dataType: 'ObjectID' },
	})
	userId: string;

	// Indexer property to allow additional data
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[prop: string]: any;

	constructor(data?: Partial<UserCredentials>) {
		super(data);
	}
}

export interface UserCredentialsRelations {
	// describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
