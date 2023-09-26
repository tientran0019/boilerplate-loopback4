import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication, RestBindings } from '@loopback/rest';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { WinstonLoggerService } from 'src/services/logger.service';
import { LogErrorProvider } from 'src/providers/log-error.provider';

import { MySequence } from 'src/sequence';
import { LoggerBindings } from 'src/keys';

export { ApplicationConfig };

export class SimplizeTripApiApplication extends BootMixin(
	ServiceMixin(RepositoryMixin(RestApplication)),
) {
	constructor(options: ApplicationConfig = {}) {
		super(options);

		this.bind(LoggerBindings.LOGGER).toClass(WinstonLoggerService);
		this.bind(RestBindings.SequenceActions.LOG_ERROR).toProvider(LogErrorProvider);

		// Set up the custom sequence
		this.sequence(MySequence);

		// Set up default home page
		this.static('/', path.join(__dirname, '../public'));

		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
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
	}
}
