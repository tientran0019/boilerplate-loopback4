/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:40:29

* Last updated on: 2023-10-09 22:40:29
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { DefaultCrudRepository, Entity, Filter, Options } from '@loopback/repository';

import { MixinTarget } from '@loopback/core';

import debugFactory from 'debug';
import mergeDeep from 'tily/object/mergeDeep';

const debug = debugFactory('extensions:pagination');

export interface PaginationRepositoryMixinOptions {
	limit?: number,
}

export interface Res {
	data: object[],
	limit: number,
	skip: number,
	total: number,
}

export interface IPaginationMixin<E extends object> {
	findWithPagination(filter?: Filter<E>, options?: Options): Promise<Res>;
}

export function PaginationRepositoryMixin<
	E extends Entity,
	ID,
	T extends MixinTarget<DefaultCrudRepository<E, ID, R>>,
	R extends object = {},
>(
	base: T,
	configs: PaginationRepositoryMixinOptions = {
		limit: 10,
	},
) {
	configs = mergeDeep({
		limit: 10,
	}, configs ?? {}) as PaginationRepositoryMixinOptions;

	debug('DEV ~ file: pagination.repository.mixin.ts:46 ~ configs:', configs);

	abstract class PaginationRepository extends base implements IPaginationMixin<E> {
		constructor(...args: any[]) {
			super(...args);
		}

		async findWithPagination(filter?: Filter<E>, options?: Options): Promise<Res> {
			const total = await super.count(filter?.where, options);

			const data = await super.find({ ...filter, limit: filter?.limit ?? configs.limit ?? 10 }, options);

			return {
				data,
				skip: filter?.skip ?? 0,
				limit: filter?.limit ?? configs.limit ?? 10,
				total: total.count ?? 0,
			};
		}
	}

	return PaginationRepository;
}
