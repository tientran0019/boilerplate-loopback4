import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';

import appRoot from 'app-root-path';
import crypto from 'crypto';

import { AuthenticationComponent } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';

import { MySequence } from 'src/sequence';

import dotenvExt from 'dotenv-extended';

import { LoggerComponent } from 'src/extensions/logger';
import {
	JWTAuthenticationComponent,
	RefreshTokenServiceBindings,
	SECURITY_SCHEME_SPEC,
	TokenServiceBindings,
} from 'src/extensions/authentication-jwt';

dotenvExt.load({
	encoding: 'utf8',
	silent: false,
	path: '.env',
	defaults: '.env.defaults',
	schema: '.env.schema',
	errorOnMissing: false,
	errorOnExtra: false,
	errorOnRegex: false,
	includeProcessEnv: false,
	assignToProcessEnv: true,
	overrideProcessEnv: false,
});

export { ApplicationConfig };

export class SimplizeTripApiApplication extends BootMixin(
	ServiceMixin(RepositoryMixin(RestApplication)),
) {
	constructor(options: ApplicationConfig = {}) {
		super(options);

		// Set up default home page
		this.static('/', appRoot + '/public');

		// Set up the custom sequence
		this.sequence(MySequence);

		// Mount logger system
		this.component(LoggerComponent);

		this.setupAuth();

		this.setupExplorers();

		this.projectRoot = __dirname;
		// Customize @loopback/boot Booter Conventions here
		this.bootOptions = {
			controllers: {
				// Customize ControllerBooter Conventions here
				dirs: ['controllers'],
				extensions: ['.controller.js'],
				nested: true,
			},
		};
	}

	setupAuth(): void {
		// Mount authentication system
		this.component(AuthenticationComponent);

		// Mount Authorization system
		this.component(AuthorizationComponent);

		// Mount jwt component
		this.component(JWTAuthenticationComponent);


		this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.TOKEN_SECRET ?? crypto.randomBytes(32).toString('hex'));
		this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.TOKEN_EXPIRES_IN ?? '21600');

		this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(process.env.REFRESH_SECRET ?? crypto.randomBytes(32).toString('hex'));
		this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(process.env.REFRESH_EXPIRES_IN ?? '216000');
		this.bind(RefreshTokenServiceBindings.REFRESH_ISSUER).to(process.env.REFRESH_ISSUER ?? 'loopback4');
	}

	setupExplorers(): void {
		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
			indexTitle: 'SimplizeTrip API Explorer',
		});
		this.component(RestExplorerComponent);
	}
}
