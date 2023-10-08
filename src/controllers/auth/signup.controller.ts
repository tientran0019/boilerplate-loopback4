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
import { pick } from 'lodash';

import { User } from 'src/models';
import { validateCredentials } from 'src/utils/validator';

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
		// ensure a valid email value and password value
		validateCredentials(pick(newUserRequest, ['email', 'password']));

		try {
			return await this.userService.createUser(newUserRequest);
		} catch (error) {
			// MongoError 11000 duplicate key
			if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
				throw new HttpErrors.Conflict('Email value is already taken');
			} else {
				throw error;
			}
		}
	}
}
