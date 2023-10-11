/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created:

* Last updated on:
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { RestBindings } from '@loopback/rest';

import {
	Binding,
	Component,
} from '@loopback/core';

import {
	LoggerBindings,
} from './keys';

import { LoggerService } from './services/logger.service';
import { LogErrorProvider } from './providers/log-error.provider';

export class LoggerComponent implements Component {
	bindings: Binding[] = [
		Binding.bind(LoggerBindings.LOGGER).toClass(LoggerService),
		Binding.bind(RestBindings.SequenceActions.LOG_ERROR).toProvider(LogErrorProvider),
	];
}
