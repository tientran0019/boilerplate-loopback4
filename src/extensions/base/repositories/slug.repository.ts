import { MetadataInspector, MixinTarget } from '@loopback/core';
import { Entity, DefaultCrudRepository, Filter, Options, PropertyMap, AnyObject } from '@loopback/repository';
import slugify from '../utils/slugify';
import { MODEL_SLUG_KEY, PropertyDefinition } from '../decorators/slug.decorator';
import debugFactory from 'debug';
import { HttpErrors } from '@loopback/rest';
import _ from 'lodash';

export const debug = debugFactory('loopback:base:slug');

/* eslint-disable @typescript-eslint/ban-ts-comment */
export function SlugRepositoryMixin<T extends Entity, Relations extends object>() {
	return function <R extends MixinTarget<DefaultCrudRepository<T, string, Relations>>>(superClass: R) {
		class SlugRepository extends superClass {
			async generateUniqueSlug(propName: string, propDef: PropertyDefinition, entity: AnyObject): Promise<string> {
				console.log('DEV ~ file: slug.repository.ts:16 ~ SlugRepository ~ generateUniqueSlug ~ propName:', propName);
				let fields: string[] | string = propDef.fields ?? ['title'];
				if (_.isString(fields)) {
					fields = [fields];
				}
				console.log('DEV ~ file: slug.repository.ts:18 ~ SlugRepository ~ generateUniqueSlug ~ fields:', fields);

				const input = _.join(
					_.filter(_.map(fields, (field: string) => entity[field])),
					'_',
				).toLowerCase();

				if (!input) {
					throw new HttpErrors.FailedDependency('Slug configs is invalid');
				}

				let slug = slugify(input, propDef.options);
				console.log('DEV ~ file: slug.repository.ts:33 ~ SlugRepository ~ generateUniqueSlug ~ slug:', slug);


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

			definePersistedModel(entityClass: typeof Entity) {
				debug('Execute method "definePersistedModel()"');
				// @ts-ignore
				const modelClass = super.definePersistedModel(entityClass);
				// @ts-ignore
				modelClass.observe('before save', async ctx => {
					if (ctx.instance) {
						debug('Run "before save" script');
						const propertyMap: PropertyMap = MetadataInspector.getAllPropertyMetadata<PropertyDefinition>(MODEL_SLUG_KEY, entityClass.prototype) ?? {};
						debug('DEV ~ file: slug.repository.ts:23 ~ SlugRepository ~ definePersistedModel ~ propertyMap:', propertyMap);

						for (const [propName, propDef] of Object.entries(propertyMap)) {
							debug('Generate slug from fields "%s" to fields "%s"', propDef.fields, propName);

							ctx.instance[propName] = await this.generateUniqueSlug(propName, propDef as PropertyDefinition, ctx.instance);
						}
					}
				});
				return modelClass;
			}

			async findBySlug(
				slug: string,
				filter?: Filter<T>,
				options?: Options,
			): Promise<(T & Relations)> {
				// @ts-ignore
				const entity = await super.findOne({ ...filter, where: { ...filter?.where, slug } }, options);

				if (!entity) {
					throw new HttpErrors.NotFound(
						`Not found with slug: ${slug}`,
					);
				}

				return entity;
			}
		}

		return SlugRepository;
	};
}

