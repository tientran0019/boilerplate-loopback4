/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 10:43:17

* Last updated on: 2023-10-06 10:43:17
* Last updated by: Tien Tran
*------------------------------------------------------- */
import {
	Credentials,
	UserService,
	RefreshTokenService,
	RefreshTokenServiceBindings,
	TokenObject,
	TokenServiceBindings,
	UserServiceBindings,
	TokenService,
} from 'src/extensions/authentication-jwt';
import { inject } from '@loopback/core';
import {
	post,
	Request,
	requestBody,
	RestBindings,
	SchemaObject,
} from '@loopback/rest';
import { UserProfile } from '@loopback/security';

const CredentialsSchema: SchemaObject = {
	type: 'object',
	required: ['email', 'password'],
	properties: {
		email: {
			type: 'string',
			format: 'email',
		},
		password: {
			type: 'string',
			minLength: 8,
		},
	},
};

export const CredentialsRequestBody = {
	description: 'The input of login function',
	required: true,
	content: {
		'application/json': { schema: CredentialsSchema },
	},
};


export class LoginController {
	constructor(
		@inject(TokenServiceBindings.TOKEN_SERVICE)
		public tokenService: TokenService,
		@inject(UserServiceBindings.USER_SERVICE)
		public userService: UserService,
		@inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
		public refreshService: RefreshTokenService,
		@inject(RestBindings.Http.REQUEST)
		private req: Request,
	) { }

	/**
   * A login function that returns refresh token and access token.
   * @param credentials User email and password
   */
	@post('/login', {
		responses: {
			'200': {
				description: 'Token',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								accessToken: {
									type: 'string',
								},
								refreshToken: {
									type: 'string',
								},
							},
						},
					},
				},
			},
		},
	})
	async login(
		@requestBody(CredentialsRequestBody) credentials: Credentials,
	): Promise<TokenObject> {
		// ensure the user exists, and the password is correct
		const user = await this.userService.verifyCredentials(credentials);

		// convert a User object into a UserProfile object (reduced set of properties)
		const userProfile: UserProfile = this.userService.convertToUserProfile(user);

		const accessToken = await this.tokenService.generateToken(userProfile);

		const tokens = await this.refreshService.generateToken(
			userProfile,
			accessToken,
			{
				useragent: this.req.get('user-agent'),
				clientId: this.req.get('x-client-id'),
				location: {
					lat: this.req.get('x-client-latitude'),
					long: this.req.get('x-client-longitude'),
				},
				ipAddress: this.req.ip,
			}
		);

		await this.userService.updateLastLogin(user);

		return tokens;
	}
}
