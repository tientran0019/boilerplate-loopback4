// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationTags } from '@loopback/authorization';

import {
	Application,
	Binding,
	Component,
	CoreBindings,
	createBindingFromClass,
	inject,
} from '@loopback/core';
import {
	RefreshTokenConstants,
	RefreshTokenServiceBindings,
	TokenServiceBindings,
	TokenServiceConstants,
	UserServiceBindings,
} from './keys';

import { UserService, RefreshTokenService } from './services';
import { JWTAuthenticationStrategy } from './services/jwt.auth.strategy';
import { TokenService } from './services/jwt.service';
import { SecuritySpecEnhancer } from './services/security.spec.enhancer';
import { MyAuthorizationProvider } from './providers/authorizer.provider';

export class JWTAuthenticationComponent implements Component {
	bindings: Binding[] = [
		// token bindings
		Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
			TokenServiceConstants.TOKEN_SECRET_VALUE,
		),
		Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
			TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
		),
		Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(TokenService),

		// user bindings
		Binding.bind(UserServiceBindings.USER_SERVICE).toClass(UserService),

		createBindingFromClass(SecuritySpecEnhancer),
		///refresh bindings
		Binding.bind(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE).toClass(
			RefreshTokenService,
		),

		//  Refresh token bindings
		Binding.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
			RefreshTokenConstants.REFRESH_SECRET_VALUE,
		),
		Binding.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
			RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE,
		),
		Binding.bind(RefreshTokenServiceBindings.REFRESH_ISSUER).to(
			RefreshTokenConstants.REFRESH_ISSUER_VALUE,
		),

		Binding
			.bind('authorizationProviders.my-authorizer-provider')
			.toProvider(MyAuthorizationProvider)
			.tag(AuthorizationTags.AUTHORIZER),
	];
	constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
		registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
	}
}
