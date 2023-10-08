import { BindingScope, inject, injectable } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenRepository } from 'src/repositories';

import { RefreshToken, RefreshTokenRelations } from 'src/models';

import {
	RefreshTokenServiceBindings,
	TokenServiceBindings,
	UserServiceBindings,
} from '../keys';
import { TokenObject } from '../types';
import { UserService } from './user.service';
import { TokenService } from './jwt.service';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@injectable({ scope: BindingScope.TRANSIENT })
export class RefreshTokenService {
	constructor(
		@inject(RefreshTokenServiceBindings.REFRESH_SECRET)
		private refreshSecret: string,
		@inject(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN)
		private refreshExpiresIn: string,
		@inject(RefreshTokenServiceBindings.REFRESH_ISSUER)
		private refreshIssure: string,
		@repository(RefreshTokenRepository)
		public refreshTokenRepository: RefreshTokenRepository,
		@inject(UserServiceBindings.USER_SERVICE) public userService: UserService,
		@inject(TokenServiceBindings.TOKEN_SERVICE) public tokenService: TokenService,
	) { }
	/**
	 * Generate a refresh token, bind it with the given user profile + access
	 * token, then store them in backend.
	 */
	async generateToken(
		userProfile: UserProfile,
		token: string,
		dataExtra: object,
	): Promise<TokenObject> {
		const data = {
			token: uuidv4(),
		};
		const refreshToken = await signAsync(data, this.refreshSecret, {
			expiresIn: Number(this.refreshExpiresIn),
			issuer: this.refreshIssure,
		});
		const result = {
			accessToken: token,
			refreshToken: refreshToken,
		};
		await this.refreshTokenRepository.create({
			...dataExtra,
			userId: userProfile[securityId],
			id: result.refreshToken,
			currentToken: token,
		});
		return result;
	}

	/*
	 * Refresh the access token bound with the given refresh token.
	 */

	async refreshToken(refreshToken: string): Promise<TokenObject> {
		try {
			if (!refreshToken) {
				throw new HttpErrors.Unauthorized(
					`Error verifying token : 'refresh token' is null`,
				);
			}

			const userRefreshData = await this.verifyToken(refreshToken);

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			const user = await this.userService.findUserById(
				userRefreshData.userId.toString(),
			);

			const userProfile: UserProfile = this.userService.convertToUserProfile(user);

			// create a JSON Web Token based on the user profile
			const token = await this.tokenService.generateToken(userProfile);

			try {
				// store token to refresh token
				await this.refreshTokenRepository.updateById(refreshToken, { currentToken: token });
			} catch (e) {
				// ignore
			}

			return {
				accessToken: token,
			};
		} catch (error) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : ${error.message}`,
			);
		}
	}

	async revokeCurrentToken(token: string): Promise<void> {
		try {
			// revoke old assess token if token is valid
			if (token) {
				await this.tokenService.verifyToken(token);

				await this.tokenService.revokeToken(token);
			}
		} catch (e) {
			// ignore
		}
	}

	async revokeToken(refreshToken: string): Promise<void> {
		try {
			const userRefreshData = await this.verifyToken(refreshToken);

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			await this.refreshTokenRepository.updateById(refreshToken, { revoked: true, revokedAt: new Date() });
		} catch (error) {
			// ignore
		}
	}

	/**
	 * Verify the validity of a refresh token, and make sure it exists in backend.
	 * @param refreshToken
	 */
	async verifyToken(
		refreshToken: string,
	): Promise<RefreshToken & RefreshTokenRelations> {
		try {
			await verifyAsync(refreshToken, this.refreshSecret);

			const userRefreshData = await this.refreshTokenRepository.findById(refreshToken);

			if (!userRefreshData) {
				throw new HttpErrors.Unauthorized(
					`Error verifying token : Invalid Token`,
				);
			}

			if (userRefreshData.revoked) {
				throw new HttpErrors.Unauthorized(
					`Error verifying token : Token is revoked`,
				);
			}
			return userRefreshData;
		} catch (error) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : ${error.message}`,
			);
		}
	}
}
