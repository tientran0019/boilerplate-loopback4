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
	Count,
	DataObject,
	Filter,
	Options,
	Where,
} from '@loopback/repository';

export interface Constructor<T> {
	prototype: T;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new(...args: any[]): T; // NOSONAR
}

// export type Constructor<T> = new (...args: any[]) => T;

export interface AbstractConstructor<T> {
	prototype: T;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new(...args: any[]): T; // NOSONAR
}

export type MixinBaseClass<T> = Constructor<T> & AbstractConstructor<T>;

export interface IBaseEntity {
	slug: string;
}

export interface SlugifyRepositoryOptions {
	fields?: string[] | string,
}

export interface ISlugifyRepositoryMixin<E extends object, ID, R> {
    findBySlug(slug: string, filter?: Filter<E>, options?: Options): Promise<(E & R) | null>;
	generateUniqueSlug(entity: DataObject<E>, options?: Options): Promise<string>;
	create(entity: DataObject<E>, options?: Options): Promise<E>;
    createAll(entities: DataObject<E>[], options?: Options): Promise<E[]>;
    save(entity: E, options?: Options): Promise<E>;
    update(entity: E, options?: Options): Promise<void>;
	updateAll(data: DataObject<E>, where?: Where<E>, options?: Options): Promise<Count>;
    updateById(id: ID, data: DataObject<E>, options?: Options): Promise<void>;
    replaceById(id: ID, data: DataObject<E>, options?: Options): Promise<void>;
}
