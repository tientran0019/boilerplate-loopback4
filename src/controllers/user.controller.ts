
import { authenticate, TokenService, UserService } from '@loopback/authentication';
import {
	Credentials,
	RefreshtokenService,
	RefreshTokenServiceBindings,
	TokenObject,
	TokenServiceBindings,
	UserServiceBindings,
} from '@loopback/authentication-jwt';
import { AUTHENTICATED, authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import { model, property, repository } from '@loopback/repository';
import {
	get,
	getModelSchemaRef,
	HttpErrors,
	param,
	post,
	put,
	requestBody,
	SchemaObject,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import IsEmail from 'isemail';
import { pick } from 'lodash';
import { SentMessageInfo } from 'nodemailer';
import { PasswordHasherBindings } from 'src/keys';

import { KeyAndPassword, ResetPasswordInit, User } from 'src/models';
import { UserRepository } from 'src/repositories';
import { PasswordHasher, UserManagementService } from 'src/services';

@model()
export class NewUserRequest extends User {
	@property({
		type: 'string',
		required: true,
	})
	password: string;
}


export function validateKeyPassword(keyAndPassword: KeyAndPassword) {
	// Validate Password Length
	if (!keyAndPassword.password || keyAndPassword.password.length < 8) {
		throw new HttpErrors.UnprocessableEntity(
			'password must be minimum 8 characters',
		);
	}

	if (keyAndPassword.password !== keyAndPassword.confirmPassword) {
		throw new HttpErrors.UnprocessableEntity(
			'password and confirmation password do not match',
		);
	}

	if (
		keyAndPassword.resetKey.length === 0 ||
		keyAndPassword.resetKey.trim() === ''
	) {
		throw new HttpErrors.UnprocessableEntity('reset key is mandatory');
	}
}

export function validateCredentials(credentials: Credentials) {
	// Validate Email
	if (!IsEmail.validate(credentials.email)) {
		throw new HttpErrors.UnprocessableEntity('invalid email');
	}

	// Validate Password Length
	if (!credentials.password || credentials.password.length < 8) {
		throw new HttpErrors.UnprocessableEntity(
			'password must be minimum 8 characters',
		);
	}
}

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

export const CredentialsRequestBody = {
	description: 'The input of login function',
	required: true,
	content: {
		'application/json': { schema: CredentialsSchema },
	},
};

export const PasswordResetRequestBody = {
	description: 'The input of password reset function',
	required: true,
	content: {
		'application/json': { schema: CredentialsSchema },
	},
};


export class UserController {
	constructor(
		@inject(TokenServiceBindings.TOKEN_SERVICE)
		public jwtService: TokenService,
		@inject(UserServiceBindings.USER_SERVICE)
		public userService: UserService<User, Credentials>,
		@inject(UserServiceBindings.USER_SERVICE)
		public userManagementService: UserManagementService,
		@inject(SecurityBindings.USER, { optional: true })
		public user: UserProfile,
		@repository(UserRepository)
		protected userRepository: UserRepository,
		@inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
		public refreshService: RefreshtokenService,
		@inject(PasswordHasherBindings.PASSWORD_HASHER)
		public passwordHasher: PasswordHasher,
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
		const userId = currentUserProfile[securityId];
		return this.userRepository.findById(userId);
	}

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

			await this.jwtService.revokeToken?.(token);

			await this.refreshService.revokeToken(refreshGrant.refreshToken);
			console.log('DEV ~ file: user.controller.ts:224 ~ UserController ~ refreshGrant.refreshToken:', refreshGrant.refreshToken);

			return {
				success: true,
			};
		} catch (err) {
			throw new HttpErrors.InternalServerError(err.message);
		}
	}

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
					}),
				},
			},
		})
			newUserRequest: NewUserRequest,
	): Promise<User> {
		// All new users have the "customer" role by default
		newUserRequest.roles = ['customer'];
		// ensure a valid email value and password value
		validateCredentials(pick(newUserRequest, ['email', 'password']));

		try {
			newUserRequest.resetKey = '';
			return await this.userManagementService.createUser(newUserRequest);
		} catch (error) {
			// MongoError 11000 duplicate key
			if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
				throw new HttpErrors.Conflict('Email value is already taken');
			} else {
				throw error;
			}
		}
	}

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

		const accessToken = await this.jwtService.generateToken(userProfile);
		const tokens = await this.refreshService.generateToken(
			userProfile,
			accessToken,
		);

		return tokens;
	}

	@post('/refresh', {
		responses: {
			'200': {
				description: 'Token',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								accessToken: {
									type: 'object',
								},
							},
						},
					},
				},
			},
		},
	})
	async refresh(
		@requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
	): Promise<TokenObject> {
		return this.refreshService.refreshToken(refreshGrant.refreshToken);
	}

	@put('/forgot-password', {
		security: [{ jwt: [] }],
		responses: {
			'200': {
				description: 'The updated user profile',
				content: {
					'application/json': {
						schema: UserProfileSchema,
					},
				},
			},
		},
	})
	@authenticate('jwt')
	async forgotPassword(
		@inject(SecurityBindings.USER) currentUserProfile: UserProfile,
		@requestBody(PasswordResetRequestBody) credentials: Credentials,
	): Promise<{ token: string }> {
		const { email, password } = credentials;
		const { id } = currentUserProfile;

		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new HttpErrors.NotFound('User account not found');
		}

		if (email !== user?.email) {
			throw new HttpErrors.Forbidden('Invalid email address');
		}

		// validateCredentials(_.pick(credentials, ['email', 'password']));

		const passwordHash = await this.passwordHasher.hashPassword(password);

		await this.userRepository.userCredentials(user.id).patch({ password: passwordHash });

		const userProfile = this.userService.convertToUserProfile(user);

		const token = await this.jwtService.generateToken(userProfile);

		return { token };
	}

	@post('/reset-password/init', {
		responses: {
			'200': {
				description: 'Confirmation that reset password email has been sent',
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
	async resetPasswordInit(
		@requestBody() resetPasswordInit: ResetPasswordInit,
	): Promise<object> {
		if (!IsEmail.validate(resetPasswordInit.email)) {
			throw new HttpErrors.UnprocessableEntity('Invalid email address');
		}

		const sentMessageInfo: SentMessageInfo =
			await this.userManagementService.requestPasswordReset(
				resetPasswordInit.email,
			);

		if (sentMessageInfo.accepted.length) {
			return {
				success: true,
				message: 'Successfully sent reset password link',
			};
		}
		throw new HttpErrors.InternalServerError(
			'Error sending reset password email',
		);
	}

	@put('/reset-password/finish', {
		responses: {
			'200': {
				description: 'A successful password reset response',
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
	async resetPasswordFinish(
		@requestBody() keyAndPassword: KeyAndPassword,
	): Promise<object> {
		validateKeyPassword(keyAndPassword);

		const foundUser = await this.userRepository.findOne({
			where: { resetKey: keyAndPassword.resetKey },
		});

		if (!foundUser) {
			throw new HttpErrors.NotFound(
				'No associated account for the provided reset key',
			);
		}

		const user = await this.userManagementService.validateResetKeyLifeSpan(
			foundUser,
		);

		const passwordHash = await this.passwordHasher.hashPassword(
			keyAndPassword.password,
		);

		try {
			await this.userRepository
				.userCredentials(user.id)
				.patch({ password: passwordHash });

			await this.userRepository.updateById(user.id, user);
		} catch (e) {
			return e;
		}

		return {
			success: true,
			message: 'Password reset successful',
		};
	}
}
