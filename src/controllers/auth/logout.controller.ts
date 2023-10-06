
/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 10:49:09

* Last updated on: 2023-10-06 10:49:09
* Last updated by: Tien Tran
*------------------------------------------------------- */
import { authenticate } from '@loopback/authentication';
import {
	TokenService,
	RefreshTokenService,
	RefreshTokenServiceBindings,
	TokenServiceBindings,
} from 'src/extensions/authentication-jwt';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
	HttpErrors,
	param,
	post,
	requestBody,
	SchemaObject,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';

import { UserRepository } from 'src/repositories';

// Describes the type of grant object taken in by method "refresh"
type RefreshGrant = {
	refreshToken: string;
};

// Describes the schema of grant object
const RefreshGrantSchema: SchemaObject = {
	type: 'object',
	required: ['refreshToken'],
	properties: {
		refreshToken: {
			type: 'string',
		},
	},
};

// Describes the request body of grant object
const RefreshGrantRequestBody = {
	description: 'Reissuing Acess Token',
	required: true,
	content: {
		'application/json': { schema: RefreshGrantSchema },
	},
};

export class LogoutController {
	constructor(
		@inject(TokenServiceBindings.TOKEN_SERVICE)
		public tokenService: TokenService,
		@inject(SecurityBindings.USER, { optional: true })
		public user: UserProfile,
		@repository(UserRepository)
		protected userRepository: UserRepository,
		@inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
		public refreshService: RefreshTokenService,
	) { }

	@authenticate('jwt')
	// @authorize({ allowedRoles: [AUTHENTICATED] })
	@post('/logout', {
		responses: {
			'200': {
				description: 'Logout',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								success: {
									type: 'boolean',
								},
								message: {
									type: 'string',
								},
							},
						},
					},
				},
			},
		},
	})
	async logout(
		@param.header.string('Authorization') accessToken: string,
		@requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
	): Promise<object> {
		try {
			const token = accessToken?.replace(/bearer /i, '');
			console.log('DEV ~ file: user.controller.ts:215 ~ UserController ~ token:', token);

			if (!token) {
				throw new HttpErrors.Unauthorized(`Error verifying token : Invalid Token`);
			}

			await this.tokenService.revokeToken(token);

			await this.refreshService.revokeToken(refreshGrant.refreshToken);
			console.log('DEV ~ file: user.controller.ts:224 ~ UserController ~ refreshGrant.refreshToken:', refreshGrant.refreshToken);

			return {
				success: true,
			};
		} catch (err) {
			throw new HttpErrors.InternalServerError(err.message);
		}
	}
}
