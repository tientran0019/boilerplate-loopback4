/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:40:29

* Last updated on: 2023-10-09 22:40:29
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { DefaultCrudRepository, Entity } from '@loopback/repository';

import {
	Constructor,
	IBaseEntity,
	ITimestampRepositoryMixin,
	MixinBaseClass,
} from '../types';
import { TimestampRepository } from '../repositories';
import extendPrototype from '../decorators/extend-prototype';

export function TimestampRepositoryMixin<
	E extends Entity & IBaseEntity,
	ID,
	T extends MixinBaseClass<DefaultCrudRepository<E, ID, R>>,
	R extends object = {},
>(base: T, configs = {}) {
	// Using extendPrototype decorator here as Typescript doesn't support multilevel inheritance.
	// This will result in a class extending `base` class overridden with `TimestampRepository`'s methods and properties.
	@extendPrototype(configs, TimestampRepository)
	class TimestampRepositoryExtended extends base { }

	return TimestampRepositoryExtended as T & Constructor<ITimestampRepositoryMixin<E>>;
}
