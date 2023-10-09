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

		// An abstraction of items managed by a context. Each binding has a unique key within the context and a value provider to resolve the key to a value.
		// the lb4 can map the data (object, configs data, interceptor, etc...) to the constant via the binding func (Bindings CONSTANT) in the app. And then we can use these data everywhere, just need to @inject the CONSTANT into the Constructor func
		// All off CONSTANTS need to be defined in the src/keys.ts file to easier management. Tips: Or we can use the property of Class: static readonly BINDING_KEY = string to defined the CONSTANT
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
