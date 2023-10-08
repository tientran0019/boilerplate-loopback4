
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
	get, getModelSchemaRef, post, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';
import { UserService, UserServiceBindings } from 'src/extensions/authentication-jwt';

import { User } from 'src/models';
import { UserRepository } from 'src/repositories';

export const UserProfileSchema = {
	type: 'object',
	required: ['id'],
	properties: {
		id: { type: 'string' },
		email: { type: 'string' },
		name: { type: 'string' },
		roles: { type: 'array' },
	},
};

export class ProfileController {
	constructor(
		@inject(SecurityBindings.USER, { optional: true })
		public currentUser: UserProfile,
		@repository(UserRepository)
		protected userRepository: UserRepository,
		@inject(UserServiceBindings.USER_SERVICE)
		protected userService: UserService,
	) { }

	@authenticate('jwt')
	// @authorize({ allowedRoles: ['admin'] })
	@get('/me', {
		responses: {
			'200': {
				description: 'Return current user',
				content: {
					'application/json': {
						schema: UserProfileSchema,
					},
				},
			},
		},
	})
	async whoAmI(): Promise<User> {
		const userId = this.currentUser[securityId];

		return this.userService.findUserById(userId);
	}

	@authenticate('jwt')
	@post('/update-profile', {
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
	async updateProfile(
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {
						title: 'UserData',
						exclude: ['id', 'email', 'username', 'role', 'status', 'emailVerified', 'verificationToken', 'lastLogin', 'createdAt', 'updatedAt'],
					}),
				},
			},
		})
		userData: Omit<User, 'id' | 'email' | 'username' | 'role' | 'status' | 'emailVerified' | 'verificationToken' | 'lastLogin' | 'createdAt' | 'updatedAt'>, // Pick<User, 'id' | 'email' | 'username' | 'role' | 'status' | 'emailVerified' | 'verificationToken' | 'lastLogin' | 'createdAt'> or User & { newProperty: string }
	): Promise<User> {
		const userId = this.currentUser[securityId];

		await this.userService.findUserById(userId);

		await this.userRepository.updateById(userId, _.omit(userData, ['id', 'email', 'username', 'role', 'status', 'emailVerified', 'verificationToken', 'lastLogin', 'createdAt', 'updatedAt']));

		return this.userService.findUserById(userId);
	}
}
