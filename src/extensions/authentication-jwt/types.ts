// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { UserProfile } from '@loopback/security';

/**
 * Built-in roles
 */
export const OWNER = '$owner';
export const EVERYONE = '$everyone';
export const AUTHENTICATED = '$authenticated';
export const UNAUTHENTICATED = '$unauthenticated';

/**
 * Describes the token object that returned by the refresh token service functions.
 */
export type TokenObject = {
	accessToken: string;
	expiresIn?: string | undefined;
	refreshToken?: string | undefined;
};

/**
 * The token refresh service. An access token expires in limited time. Therefore
 * token refresh service is needed to keep replacing the old access token with
 * a new one periodically.
 */
export interface IRefreshTokenService {
	/**
	 * Generate a refresh token, bind it with the given user profile + access
	 * token, then store them in backend.
	 */
	generateToken(userProfile: UserProfile, token: string, extraData: object): Promise<TokenObject>;

	/**
	 * Refresh the access token bound with the given refresh token.
	 */
	revokeToken(refreshToken: string): Promise<void>;

	/**
	 * Refresh the access token bound with the given refresh token.
	 */
	refreshToken(refreshToken: string): Promise<TokenObject>;
}
