
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
	get,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';

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

export class GetProfileController {
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
	async whoAmI(@inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<User> {
		const userId = this.currentUser[securityId];
		return this.userRepository.findById(userId);
	}
}
