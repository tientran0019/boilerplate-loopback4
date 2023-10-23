import { MixinTarget } from '@loopback/core';
import {
	AnyObject,
	Count,
	DataObject,
	DefaultCrudRepository,
	Entity,
	Filter,
	FilterExcludingWhere,
	Options,
	PropertyMap,
	Where,
} from '@loopback/repository';
import debugFactory from 'debug';
import { MODEL_SLUG_KEY, PropertyDefinition } from '../decorators/slug.decorator';
import _ from 'lodash';
import { HttpErrors } from '@loopback/rest';
import slugify from '../utils/slugify';
import { MetadataInspector } from '@loopback/metadata';
import { SlugModel } from './slug.model.mixin';

export const debug = debugFactory('loopback:base:mixin:slug');

export interface SlugRepositoryOperationOptions extends Options {
	skipUpdate?: boolean;
}

export interface SlugRepository<T extends Entity & SlugModel, ID, Relations extends object> {
	generateUniqueSlug(propName: string, propDef: PropertyDefinition, entity: AnyObject): Promise<string>;
	findBySlug(slug: string, filter?: Filter<T>, options?: Options): Promise<(T & Relations) | null>;
	create(entity: DataObject<T>, options?: Options): Promise<T>;
}

export function SlugRepositoryMixin(
	opts: SlugRepositoryOperationOptions= {},
) {
	return <
		T extends Entity & SlugModel,
		ID,
		Relations extends object,
		R extends MixinTarget<DefaultCrudRepository<T, ID, Relations>>,
	>(superClass: R) => {
		class MixedRepository extends superClass implements SlugRepository<T, ID, Relations> {

			// @ts-ignore
			async generateUniqueSlug(propName: string, propDef: PropertyDefinition, entity: AnyObject): Promise<string> {
				let fields: string[] | string = propDef.fields ?? ['title'];
				if (_.isString(fields)) {
					fields = [fields];
				}

				const input = _.join(
					_.filter(_.map(fields, (field: string) => entity[field])),
					'_',
				).toLowerCase();

				if (!input) {
					throw new HttpErrors.FailedDependency('Slug configs is invalid');
				}

				let slug = slugify(input, propDef.options);


				const regex = slug === '0' ? new RegExp('^([0-9]+)$') : new RegExp(`^${slug}(-[0-9]+){0,2}$`);

				const where = { [propName]: { like: regex } } as any;
				console.log('DEV ~ file: slug.repository.ts:39 ~ SlugRepository ~ generateUniqueSlug ~ where:', where);

				const similarInstances = await super.find({ where });

				if (similarInstances.length > 0) {
					let maxCount = 0;
					_.forEach(similarInstances, (similarInstance: any) => {
						// console.log('DEV ~ file: slug.repository.ts:46 ~ SlugRepository ~ _.forEach ~ similarInstance:', similarInstance);
						// console.log('DEV ~ file: slug.repository.ts:42 ~ SlugRepository ~ _.forEach ~ similarInstances:', similarInstances);
						const match = similarInstance[propName]?.match(regex) ?? [];

						let count = 0;
						if (match[1]) {
							count = parseInt(match[1].replace('-', ''), 10);
						}
						if (count > maxCount) {
							maxCount = count;
						}
					});

					slug += '-' + (maxCount + 1);
				}
				console.log('DEV ~ file: slug.repository.ts:58 ~ SlugRepository ~ generateUniqueSlug ~ slug:', slug);

				return slug;
			}

			// @ts-ignore
			async findBySlug(
				slug: string,
				filter?: Filter<T>,
				options?: Options,
			): Promise<(T & Relations) | null> {
				// @ts-ignore
				const entity = await super.findOne({ ...filter, where: { ...filter?.where, slug } }, options);

				if (!entity) {
					throw new HttpErrors.NotFound(
						`Not found with slug: ${slug}`,
					);
				}

				return entity;
			}


			// @ts-ignore
			async create(entity: DataObject<T>, options?: Options): Promise<T> {
				const propertyMap: PropertyMap = MetadataInspector.getAllPropertyMetadata<PropertyDefinition>(MODEL_SLUG_KEY, superClass.prototype) ?? {};
				debug('DEV ~ file: slug.repository.ts:23 ~ SlugRepository ~ definePersistedModel ~ propertyMap:', propertyMap);

				for (const [propName, propDef] of Object.entries(propertyMap)) {
					debug('Generate slug from fields "%s" to fields "%s"', propDef.fields, propName);

					// @ts-ignore
					entity[propName] = await this.generateUniqueSlug(propName, propDef as PropertyDefinition, entity);
				}

				return super.create(entity, options);
			}

			// // @ts-ignore
			// async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
			// 	let currentUser = await this.getCurrentUser?.();
			// 	currentUser = currentUser ?? options?.currentUser;
			// 	if (!currentUser && throwIfNoUser) {
			// 		throw new HttpErrors.Forbidden(InvalidCredentials);
			// 	}
			// 	const uid = getUserId(currentUser);
			// 	entities.forEach(entity => {
			// 		entity.createdBy = uid ?? '';
			// 		entity.updatedBy = uid ?? '';
			// 	});
			// 	return super.createAll(entities, options);
			// }

			// // @ts-ignore
			// async save(entity: T, options?: SlugRepositoryOperationOptions): Promise<T> {
			// 	if (!options?.skipUpdate) {
			// 		entity.updatedAt = new Date();
			// 	}
			// 	return super.save(entity, options);
			// }

			// // @ts-ignore
			// async update(entity: T, options?: SlugRepositoryOperationOptions): Promise<void> {
			// 	if (!options?.skipUpdate) {
			// 		entity.updatedAt = new Date();
			// 	}
			// 	return super.update(entity, options);
			// }

			// // @ts-ignore
			// async updateAll(
			// 	data: DataObject<T>,
			// 	where?: Where<T>,
			// 	options?: SlugRepositoryOperationOptions,
			// ): Promise<Count> {
			// 	if (!options?.skipUpdate) {
			// 		data.updatedAt = new Date();
			// 	}
			// 	return super.updateAll(data, where, options);
			// }

			// // @ts-ignore
			// async updateById(id: ID, data: DataObject<T>, options?: SlugRepositoryOperationOptions): Promise<void> {
			// 	if (!options?.skipUpdate) {
			// 		data.updatedAt = new Date();
			// 	}
			// 	return super.updateById(id, data, options);
			// }

			// // @ts-ignore
			// async replaceById(id: ID, data: DataObject<T>, options?: SlugRepositoryOperationOptions): Promise<void> {
			// 	if (!options?.skipUpdate) {
			// 		data.updatedAt = new Date();
			// 	}
			// 	const model = await this.findById(id, { fields: ['id', 'createdAt'] } as FilterExcludingWhere<T>, options);
			// 	data.createdAt = model.createdAt;
			// 	return super.replaceById(id, data, options);
			// }
		}

		return MixedRepository;
	};
}
