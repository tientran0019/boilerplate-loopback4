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
	DataObject,
	Filter,
	Options,
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

export interface ISlugifyRepositoryMixin<T extends object, ID, R> {
	findUniqueSlug(entity: DataObject<T>, options?: Options): Promise<string>;
	create(entity: DataObject<T>, options?: Options): Promise<T>;
    // createAll(entities: DataObject<T>[], options?: Options): Promise<T[]>; TODO: Make it in the future
    save(entity: T, options?: Options): Promise<T>;
    update(entity: T, options?: Options): Promise<void>;
	// updateAll(data: DataObject<T>, where?: Where<T>, options?: Options): Promise<Count>;
    updateById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
    replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
    findBySlug(slug: string, filter?: Filter<T>, options?: Options): Promise<T & R>;
}
