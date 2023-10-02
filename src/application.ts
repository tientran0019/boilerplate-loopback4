import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication, RestBindings } from '@loopback/rest';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import appRoot from 'app-root-path';

import { LoggerService } from 'src/services/logger.service';
import { LogErrorProvider } from 'src/providers/log-error.provider';
import { LoggerBindings } from 'src/keys';
import { MySequence } from 'src/sequence';

export { ApplicationConfig };

export class SimplizeTripApiApplication extends BootMixin(
	ServiceMixin(RepositoryMixin(RestApplication)),
) {
	constructor(options: ApplicationConfig = {}) {
		super(options);

		this.bind(LoggerBindings.LOGGER).toClass(LoggerService);
		this.bind(RestBindings.SequenceActions.LOG_ERROR).toProvider(LogErrorProvider);

		// Set up default home page
		this.static('/', appRoot + '/public');

		// Set up the custom sequence
		this.sequence(MySequence);

		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
			indexTitle: 'SimplizeTrip API Explorer',
		});
		this.component(RestExplorerComponent);

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

		// this.setupLogging();
	}

	// add morgan

	// private setupLogging() {
	// 	const morganFactory = (config?: morgan.Options<Request, Response>) => {
	// 		this.debug('Morgan configuration', config);
	// 		return morgan('combined', config);
	// 	};

	// 	const defaultConfig: morgan.Options<Request, Response> = {};

	// 	this.expressMiddleware(morganFactory, defaultConfig, {
	// 		injectConfiguration: 'watch',
	// 		key: 'middleware.morgan',
	// 	});
	// }
}
