import { BindingKey } from '@loopback/core';
import { LoggerService } from 'src/services/logger.service';

export namespace LoggerBindings {
	export const LOGGER = BindingKey.create<InstanceType<typeof LoggerService>>('services.logger');
}
