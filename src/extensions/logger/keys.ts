/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 15:24:27

* Last updated on: 2023-10-06 15:24:27
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { BindingKey } from '@loopback/core';
import { LoggerService } from './services/logger.service';

export namespace LoggerBindings {
	export const LOGGER = BindingKey.create<InstanceType<typeof LoggerService>>('services.logger');
}
