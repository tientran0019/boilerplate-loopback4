// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { UserService as IUserService } from '@loopback/authentication';
import { model, property, repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';

import { User, UserWithRelations } from 'src/models';
import { UserRepository } from 'src/repositories';
import { comparePassword, hashPassword } from 'src/utils/password-bcryptjs';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export type Credentials = {
	email: string;
	password: string;
};

@model()
export class NewUserRequest extends User {
	@property({
		type: 'string',
		required: true,
	})
	password: string;
}

export class UserService implements IUserService<User, Credentials> {
	constructor(
		@repository(UserRepository) public userRepository: UserRepository,
	) { }

	async verifyCredentials(credentials: Credentials): Promise<User> {
		const { email, password } = credentials;

		const invalidCredentialsError = 'Invalid email or password.';

		if (!email) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}
		const foundUser = await this.userRepository.findOne({
			where: { email: email },
		});

		if (!foundUser) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}
		if (foundUser.status !== 'active') {
			throw new HttpErrors.Unauthorized('User is inactive');
		}

		const credentialsFound = await this.userRepository.findCredentials(
			foundUser.id,
		);
		if (!credentialsFound) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}

		const passwordMatched = await comparePassword(
			password,
			credentialsFound.password,
		);

		if (!passwordMatched) {
			throw new HttpErrors.Unauthorized(invalidCredentialsError);
		}

		return foundUser;
	}

	convertToUserProfile(user: User): UserProfile {
		return {
			[securityId]: user.id.toString(),
			name: user.fullName,
			id: user.id,
			email: user.email,
			role: user.role,
		};
	}

	async createUser(userWithPassword: NewUserRequest): Promise<User> {
		const { password, ...userData } = userWithPassword;

		// const foundUser = await this.userRepository.findOne({
		// 	where: { email: userWithPassword.email },
		// });

		// if (foundUser) {
		// 	throw new HttpErrors.Conflict('Email value is already taken1');
		// }

		// if (!userData.username) {
		// 	userData.username = userData.email.split('@')[0];
		// }

		const passwordHashed = await hashPassword(password);

		const user = await this.userRepository.create({ ...userData, role: 'customer', username: userData.email.split('@')[0] });

		user.id = user.id?.toString();

		await this.userRepository.userCredentials(user.id).create({ password: passwordHashed });

		return user;
	}

	//function to find user by id
	async findUserById(id: string): Promise<User & UserWithRelations> {
		const userNotfound = 'invalid User';
		const foundUser = await this.userRepository.findById(id);

		if (!foundUser) {
			throw new HttpErrors.Unauthorized(userNotfound);
		}
		return foundUser;
	}

	async updateLastLogin(user: User): Promise<void> {
		try {
			user.lastLogin = new Date();

			await this.userRepository.update(user);
		} catch (error) {
			// ignore
		}
	}
}
