/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 11:07:50

* Last updated on: 2023-10-09 11:07:50
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject, Getter, Constructor } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';

import { MongoDataSource } from 'src/datasources';
import { User, Category, Article, ArticleRelations } from '../models';
import { UserRepository } from './user.repository';
import { CategoryRepository } from './category.repository';
import { SlugifyRepositoryMixin, SlugifyRepositoryMixinOptions } from 'src/extensions/slugify';

export class ArticleRepository extends SlugifyRepositoryMixin<
	Article,
	typeof Article.prototype.id,
	Constructor<
		DefaultCrudRepository<Article, typeof Article.prototype.id, ArticleRelations>
	>
>(DefaultCrudRepository) {

	public readonly creator: BelongsToAccessor<User, typeof Article.prototype.id>;

	public readonly category: BelongsToAccessor<Category, typeof Article.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		@repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
		protected readonly configs: SlugifyRepositoryMixinOptions = { fields: ['title'] },
	) {
		super(Article, dataSource, configs);
		this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
		this.registerInclusionResolver('category', this.category.inclusionResolver);
		this.creator = this.createBelongsToAccessorFor('creator', userRepositoryGetter,);
		this.registerInclusionResolver('creator', this.creator.inclusionResolver);
	}

	// definePersistedModel(entityClass: typeof Article) {
	// 	// console.log('DEV ~ file: article.repository.ts:47 ~ definePersistedModel ~ entityClass:', entityClass.definition);

	// 	const modelClass = super.definePersistedModel(entityClass);

	// 	// Migrating CRUD operation hooks
	// 	// https://loopback.io/doc/en/lb4/migration-models-operation-hooks.html
	// 	/*
	// 		beforeValidate	before save
	// 		afterValidate	persist
	// 		beforeCreate	before save
	// 		afterCreate	after save
	// 		beforeSave	before save
	// 		afterSave	after save
	// 		beforeUpdate	before save
	// 		afterUpdate	after save
	// 		beforeDestroy	before delete
	// 		afterDestroy	after delete
	// 	*/

	// 	// ObserverMixin members are added as static methods, this is difficult to
	// 	// describe in TypeScript in a way that's easy to use by consumers.
	// 	// As a workaround, we include a copy of ObserverMixin members here.
	// 	//
	// 	// Ideally, we want to describe the context argument as
	// 	// `OperationHookContext<this>`. Unfortunately, that's not supported by
	// 	// TypeScript for static members. A nice workaround is described in
	// 	// https://github.com/microsoft/TypeScript/issues/5863#issuecomment-410887254
	// 	// - Describe the context using a generic argument `T`.
	// 	// - Use `this: T` argument to let the compiler infer what's the target
	// 	//   model class we are going to observe.

	// 	/**
	// 	 * Register an asynchronous observer for the given operation (event).
	// 	 *
	// 	 * Example:
	// 	 *
	// 	 * Registers a `before save` observer for a given model.
	// 	 *
	// 	 * ```javascript
	// 	 * MyModel.observe('before save', function filterProperties(ctx, next) {
	// 	 *   if (ctx.options && ctx.options.skipPropertyFilter) return next();
	// 	 *     if (ctx.instance) {
	// 	 *       FILTERED_PROPERTIES.forEach(function(p) {
	// 	 *       ctx.instance.unsetAttribute(p);
	// 	 *     });
	// 	 *   } else {
	// 	 *     FILTERED_PROPERTIES.forEach(function(p) {
	// 	 *       delete ctx.data[p];
	// 	 *     });
	// 	 *   }
	// 	 *   next();
	// 	 * });
	// 	 * ```
	// 	 *
	// 	 * @param {String} operation The operation name.
	// 	 * @callback {function} listener The listener function. It will be invoked with
	// 	 * `this` set to the model constructor, e.g. `User`.
	// 	 * @end
	// 	 */

	// 	modelClass.observe('before save', (ctx, next) => { // 'persist' operation will include the id and entires instance
	// 		console.log(`going to save ${ctx.Model.modelName}`);

	// 		const { instance, data, Model, isNewInstance, hookState, options } = ctx;
	// 		// console.log('DEV ~ file: article.repository.ts:55 ~ modelClass.observe ~ data:', data);
	// 		// console.log('DEV ~ file: article.repository.ts:55 ~ modelClass.observe ~ instance:', ctx);
	// 		// console.log('DEV ~ file: article.repository.ts:54 ~ definePersistedModel ~ Model:', Model.getUpdateOnlyProperties());
	// 		// console.log('DEV ~ file: article.repository.ts:54 ~ definePersistedModel ~ Model:', ctx.options);
	// 		// console.log('DEV ~ file: article.repository.ts:54 ~ definePersistedModel ~ Model:', ctx.Model.definition);
	// 		// console.log('DEV ~ file: article.repository.ts:54 ~ definePersistedModel ~ instance:', instance);

	// 		// ctx.data.updatedAt = +new Date();

	// 		// delete ctx.data.createdAt;

	// 		next(); // next(err)
	// 	});

	// 	return modelClass;
	// }
}
