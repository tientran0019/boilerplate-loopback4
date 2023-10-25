/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:34:47

* Last updated on: 2023-10-09 22:34:47
* Last updated by: Tien Tran
*------------------------------------------------------- */

import {
	Entity,
	juggler,
} from '@loopback/repository';

export interface Constructor<T> {
	prototype: T;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new(...args: any[]): T; // NOSONAR
}

export interface AbstractConstructor<T> {
	prototype: T;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new(...args: any[]): T; // NOSONAR
}

export type MixinBaseClass<T> = Constructor<T> & AbstractConstructor<T>;

export interface IBaseEntity {
	createdAt?: number;
	updatedAt?: number;
}

export interface ITimestampRepositoryMixin<E> {
	definePersistedModel(entityClass: typeof Entity & { prototype: E }): typeof juggler.PersistedModel;
}
