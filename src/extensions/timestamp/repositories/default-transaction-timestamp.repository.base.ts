/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 23:56:49

* Last updated on: 2023-10-09 23:56:49
* Last updated by: Tien Tran
*------------------------------------------------------- */

// DEVELOPMENT NOTE:
// Please ensure that any modifications made to this file are also applied to the following locations:
// 1) src/repositories/default-transaction-Timestamp.repository.base.ts

import {
	DefaultTransactionalRepository,
	Entity,
	juggler,
} from '@loopback/repository';

import { TimestampEntity } from '../models/timestamp.entity';

export class TimestampTransactionalRepository<
	E extends TimestampEntity,
	ID,
	R extends object = {},
> extends DefaultTransactionalRepository<E, ID, R> {
	constructor(
		entityClass: typeof Entity & {
			prototype: E;
		},
		dataSource: juggler.DataSource,
		// protected readonly configs: TimestampRepositoryMixinOptions = {},
	) {
		super(entityClass, dataSource);
	}

	definePersistedModel(entityClass: typeof Entity & { prototype: E }) {
		// console.log('DEV ~ file: article.repository.ts:47 ~ definePersistedModel ~ entityClass:', entityClass.definition);

		const modelClass = super.definePersistedModel(entityClass);

		// Migrating CRUD operation hooks
		// https://loopback.io/doc/en/lb4/migration-models-operation-hooks.html
		/*
			beforeValidate	before save
			afterValidate	persist
			beforeCreate	before save
			afterCreate	after save
			beforeSave	before save
			afterSave	after save
			beforeUpdate	before save
			afterUpdate	after save
			beforeDestroy	before delete
			afterDestroy	after delete
		*/

		// ObserverMixin members are added as static methods, this is difficult to
		// describe in TypeScript in a way that's easy to use by consumers.
		// As a workaround, we include a copy of ObserverMixin members here.
		//
		// Ideally, we want to describe the context argument as
		// `OperationHookContext<this>`. Unfortunately, that's not supported by
		// TypeScript for static members. A nice workaround is described in
		// https://github.com/microsoft/TypeScript/issues/5863#issuecomment-410887254
		// - Describe the context using a generic argument `T`.
		// - Use `this: T` argument to let the compiler infer what's the target
		//   model class we are going to observe.

		/**
		 * Register an asynchronous observer for the given operation (event).
		 *
		 * Example:
		 *
		 * Registers a `before save` observer for a given model.
		 *
		 * ```ts
		 * MyModel.observe('before save', function filterProperties(ctx, next) {
		 *   if (ctx.options && ctx.options.skipPropertyFilter) return next();
		 *     if (ctx.instance) {
		 *       FILTERED_PROPERTIES.forEach(function(p) {
		 *       ctx.instance.unsetAttribute(p);
		 *     });
		 *   } else {
		 *     FILTERED_PROPERTIES.forEach(function(p) {
		 *       delete ctx.data[p];
		 *     });
		 *   }
		 *   next();
		 * });
		 * ```
		 *
		 * @param {String} operation The operation name.
		 * @callback {function} listener The listener function. It will be invoked with
		 * `this` set to the model constructor, e.g. `User`.
		 * @end
		 */

		modelClass.observe('before save', (ctx, next) => { // 'persist' operation will include the id and entires instance
			console.log(`going to save ${ctx.Model.modelName}`);

			console.log('ctx.Model', ctx.Model.definition.properties);
			console.log('this', entityClass.definition);
			// if (ctx.options?.skipPropertyFilter) {
			// 	return next();
			// }

			// if (ctx.instance) {
			// 	FILTERED_PROPERTIES.forEach(function (p) {
			// 		ctx.instance.unsetAttribute(p);
			// 	});
			// } else {
			// 	FILTERED_PROPERTIES.forEach(function (p) {
			// 		delete ctx.data[p];
			// 	});
			// }
			next(); // next(err)
		});

		return modelClass;
	}
}
