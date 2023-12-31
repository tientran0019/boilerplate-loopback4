/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:40:29

* Last updated on: 2023-10-09 22:40:29
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Count, DataObject, DefaultCrudRepository, Entity, FilterExcludingWhere, Options, Where } from '@loopback/repository';

import {
	IBaseEntity,
} from '../types';
import { MixinTarget } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';

import debugFactory from 'debug';
import { UserProfile } from '@loopback/security';
import mergeDeep from 'tily/object/mergeDeep';

const debug = debugFactory('extensions:timestamp');

export interface TimestampRepositoryMixinOptions {
	userTracking?: boolean,
	/**
	 * Throw InvalidCredentials error if no getCurrentUser function provided or no user signed in.
	 */
	throwIfNoUser?: boolean;
	createdField?: string,
	updatedField?: string,
}

export function TimestampRepositoryMixin<
	E extends Entity & IBaseEntity,
	ID,
	T extends MixinTarget<DefaultCrudRepository<E, ID, R>>,
	R extends object = {},
>(
	base: T,
	configs?: TimestampRepositoryMixinOptions,
) {
	const { createdField, updatedField, throwIfNoUser, userTracking } = mergeDeep({
		userTracking: true,
		throwIfNoUser: true,
		createdField: 'createdById',
		updatedField: 'lastUpdatedById',
	}, configs ?? {}) as TimestampRepositoryMixinOptions;

	debug('DEV ~ file: timestamp.repository.mixin.ts:46 ~ configs:', configs);

	abstract class TimestampRepository extends base {
		currentUser?: UserProfile;

		constructor(
			...args: any[]
		) {
			super(...args);
		}

		// @ts-ignore
		async create(entity: DataObject<E>, options?: Options): Promise<E> {
			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				entity[createdField] = userId;
				// @ts-ignore
				delete entity[updatedField];
			}

			return super.create(entity, options) as any;
		}

		// @ts-ignore
		async createAll(entities: DataObject<E>[], options?: Options): Promise<E[]> {
			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}

				entities.forEach(entity => {
					// @ts-ignore
					entity[createdField] = userId;
					// @ts-ignore
					delete entity[updatedField];
				});
			}

			return super.createAll(entities, options);
		}

		// @ts-ignore
		async save(entity: E, options?: Options): Promise<E> {

			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				entity[updatedField] = userId;
				// @ts-ignore
				delete entity[createdField];
			}

			if (!options?.skipUpdatedAt) {
				entity.updatedAt = +new Date();
			}
			delete entity.createdAt;

			return super.save(entity, options);
		}

		// @ts-ignore
		async update(entity: E, options?: Options): Promise<void> {
			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				entity[updatedField] = userId;
				// @ts-ignore
				delete entity[createdField];
			}
			if (!options?.skipUpdatedAt) {
				entity.updatedAt = +new Date();
			}
			delete entity.createdAt;
			return super.update(entity, options);
		}

		// @ts-ignore
		async updateAll(
			data: DataObject<E>,
			where?: Where<E>,
			options?: Options,
		): Promise<Count> {
			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				data[updatedField] = userId;
				// @ts-ignore
				delete data[createdField];
			}
			if (!options?.skipUpdatedAt) {
				data.updatedAt = +new Date();
			}
			delete data.createdAt;
			return super.updateAll(data, where, options);
		}

		// @ts-ignore
		async updateById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				data[updatedField] = userId;
				// @ts-ignore
				delete data[createdField];
			}
			if (!options?.skipUpdatedAt) {
				data.updatedAt = +new Date();
			}
			delete data.createdAt;
			return super.updateById(id, data, options);
		}

		// @ts-ignore
		async replaceById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
			const model = await this.findById(id, { fields: ['id', 'createdAt', createdField] } as FilterExcludingWhere<E>, options);

			if (userTracking) {
				const userId = this.currentUser?.id ?? options?.currentUserId;

				if (!userId && throwIfNoUser) {
					throw new HttpErrors.Forbidden('Invalid Credentials');
				}
				// @ts-ignore
				data[updatedField] = userId;
				// @ts-ignore
				data[createdField] = model[createdField];
			}
			if (!options?.skipUpdatedAt) {
				data.updatedAt = +new Date();
			}
			data.createdAt = model.createdAt;
			return super.replaceById(id, data, options);
		}

		// definePersistedModel(entityClass: typeof Entity & { prototype: E }) {
		// 	// @ts-ignore
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
		// 	 * ```ts
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
		// 	// @ts-ignore
		// 	modelClass.observe('before save', (ctx, next) => { // 'persist' operation will include the id and entires instance
		// 		debug(`Going to save ${ctx.Model.modelName}`);
		// 		// debug('ctx ', inspect(ctx, false, null, true));
		// 		debug('Data ', inspect(ctx.instance ?? ctx.data));

		// 		if (!ctx.isNewInstance) {
		// 			if (ctx.instance) {
		// 				debug('Replace by id of instance');
		// 				// ! Can't next when error ocurred in this case

		// 				return this.findById(ctx.instance.id).then((el) => {
		// 					debug('Current instance ', el);

		// 					ctx.instance.createdAt = el.createdAt;
		// 					ctx.instance.updatedAt = +new Date();

		// 					// next(); // TODO Can't next when error ocurred
		// 				}).catch((e) => {
		// 					debug('get current instance error ', e);

		// 					throw e;
		// 				});
		// 			} else {
		// 				debug('Patch by id of data');

		// 				delete ctx.data.createdAt;
		// 				ctx.data.updatedAt = +new Date();

		// 				next();
		// 			}
		// 		} else {
		// 			debug('Create new instance');

		// 			next(); // next(err)
		// 		}
		// 	});

		// 	return modelClass;
		// }
	}

	debug('DEV ~ file: timestamp.repository.mixin.ts:33 ~ base:', Object.getOwnPropertyNames(TimestampRepository.prototype));

	return TimestampRepository;
}
