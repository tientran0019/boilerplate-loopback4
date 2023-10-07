
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
	get, getModelSchemaRef, post, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';

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
		return this.userRepository.findById(userId);
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
					}),
				},
			},
		})
		userData: User,
	): Promise<User> {
		const userId = this.currentUser[securityId];

		await this.userRepository.updateById(userId, _.omit(userData, ['email', 'username', 'role', 'status', 'emailVerified', 'verificationToken', 'lastLogin']));

		return this.userRepository.findById(userId);
	}
}
