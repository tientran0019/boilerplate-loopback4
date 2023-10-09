/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 20:21:57

* Last updated on: 2023-10-09 20:21:57
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { MixinTarget } from '@loopback/core';
import { Entity, FilterExcludingWhere, Model } from '@loopback/repository';
import { param, get, getModelSchemaRef, response } from '@loopback/rest';
import { FindBySlugRepository } from './repository.find-by-slug.mixin';

/**
 * Options to mix in findBySlug
 */
export interface FindBySlugControllerMixinOptions {
	/**
	 * Base path for the controller
	 */
	basePath: string;
	/**
	 * Model class for CRUD
	 */
	modelClass: typeof Model;
}

/**
 * A mixin factory for controllers to be extended by `FindBySlug`
 * @param superClass - Base class
 * @param options - Options for the controller
 *
 * @typeParam M - Model class
 * @typeParam T - Base class
 */
export function FindBySlugControllerMixin<
	E extends Entity,
	T extends MixinTarget<object>,
>(superClass: T, options: FindBySlugControllerMixinOptions) {
	class MixedController extends superClass {
		// Value will be provided by the subclassed controller class
		repository: FindBySlugRepository<E, {}>;

		@get(`${options.basePath}/findBySlug/{slug}`)
		@response(200, {
			description: `${options.modelClass.modelName} model instances`,
			content: {
				'application/json': {
					schema: getModelSchemaRef(options.modelClass, { includeRelations: true }),
				},
			},
		})
		async findBySlug(
			@param.path.string('slug') slug: string,
			@param.filter(options.modelClass, { exclude: 'where' }) filter?: FilterExcludingWhere<E>
		): Promise<E | null> {
			return this.repository.findBySlug(slug, filter);
		}
	}

	return MixedController;
}
