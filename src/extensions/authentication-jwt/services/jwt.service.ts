// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { TokenService as ITokenService } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { promisify } from 'util';
import { TokenServiceBindings } from '../keys';
import { RevokedTokenRepository } from 'src/repositories';
import { repository } from '@loopback/repository';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class TokenService implements ITokenService {
	constructor(
		@inject(TokenServiceBindings.TOKEN_SECRET)
		private jwtSecret: string,
		@inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
		private jwtExpiresIn: string,
		@repository(RevokedTokenRepository)
		public revokedTokenRepository: RevokedTokenRepository,
	) { }

	async verifyToken(token: string): Promise<UserProfile> {
		if (!token) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : 'token' is null`,
			);
		}
		if (await this.revokedTokenRepository.get(token)) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : Token is revoked`,
			);
		}

		let userProfile: UserProfile;

		try {
			// decode user profile from token
			const decodedToken = await verifyAsync(token, this.jwtSecret);
			// don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
			userProfile = Object.assign(
				{ [securityId]: '', name: '' },
				{
					[securityId]: decodedToken.id,
					name: decodedToken.name,
					id: decodedToken.id,
					role: decodedToken.role,
				},
			);
		} catch (error) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : ${error.message}`,
			);
		}
		return userProfile;
	}

	async revokeToken(token: string): Promise<boolean> {
		try {
			await this.revokedTokenRepository.set(token, { token });

			return true;
		} catch (error) {
			// ignore
			return false;
		}
	}

	async generateToken(userProfile: UserProfile): Promise<string> {
		if (!userProfile) {
			throw new HttpErrors.Unauthorized(
				'Error generating token : userProfile is null',
			);
		}
		const userInfoForToken = {
			id: userProfile[securityId],
			name: userProfile.name,
			email: userProfile.email,
			role: userProfile.role,
		};
		// Generate a JSON Web Token
		let token: string;
		try {
			token = await signAsync(userInfoForToken, this.jwtSecret, {
				expiresIn: Number(this.jwtExpiresIn),
			});
		} catch (error) {
			throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
		}

		return token;
	}
}
