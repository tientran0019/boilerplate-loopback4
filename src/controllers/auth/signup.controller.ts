/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 10:43:33

* Last updated on: 2023-10-06 10:43:33
* Last updated by: Tien Tran
*------------------------------------------------------- */
import {
	NewUserRequest,
	UserService,
	UserServiceBindings,
} from 'src/extensions/authentication-jwt';
import { inject } from '@loopback/core';

import {
	getModelSchemaRef,
	HttpErrors,
	post,
	requestBody,
} from '@loopback/rest';

import { User } from 'src/models';

export class SignupController {
	constructor(
		@inject(UserServiceBindings.USER_SERVICE)
		private userService: UserService,
	) { }

	@post('/signup', {
		responses: {
			'200': {
				description: 'User',
				content: {
					'application/json': {
						schema: {
							'x-ts-type': User,
						},
					},
				},
			},
		},
	})
	async signUp(
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(NewUserRequest, {
						title: 'NewUser',
						exclude: ['id', 'username', 'role', 'status', 'emailVerified', 'verificationToken', 'lastLogin', 'createdAt', 'updatedAt'],
					}),
				},
			},
		})
		newUserRequest: NewUserRequest,
	): Promise<User> {
		try {
			return await this.userService.createUser(newUserRequest);
		} catch (error) {
			// MongoError 11000 duplicate key
			if (error.code === 11000) {
				throw new HttpErrors.Conflict(`${Object.entries(error.keyValue).flat().join(' ')} value is already taken`);
			} else {
				throw error;
			}
		}
	}
}
