/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:40:29

* Last updated on: 2023-10-09 22:40:29
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { AnyObject, Condition, Count, DataObject, DefaultCrudRepository, Entity, Filter, Options, Where } from '@loopback/repository';

import {
	IBaseEntity,
	ISlugifyRepositoryMixin,
	SlugifyRepositoryOptions,
} from '../types';
import { MixinTarget } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { cloneDeep, forEach } from 'lodash';
import async from 'async';

import slugify from '../utils/slugify';
import { SlugifyFilterBuilder } from '../utils/filter-builder';

import debugFactory from 'debug';
import mergeDeep from 'tily/object/mergeDeep';
import toArray from 'tily/array/toArray';

const debug = debugFactory('extensions:slugify');

export function SlugifyRepositoryMixin<
	E extends Entity & IBaseEntity,
	ID,
	T extends MixinTarget<DefaultCrudRepository<E, ID, R>>,
	R extends object = {},
>(base: T, configs: SlugifyRepositoryOptions = {}) {
	configs = mergeDeep({
		fields: ['name'],
		options: {
			lower: true,
			strict: true,
		},
	}, configs ?? {});

	const generateSlug = (data: AnyObject): string => {
		const fields: string[] = toArray(configs?.fields ?? []);

		const input = fields.map((field) => {
			return data[field];
		}).filter(el => {
			return !!el;
		});

		if (input.length === 0) {
			// throw new HttpErrors.FailedDependency('Slug configs is invalid');
			return '';
		}

		return slugify(input.join('_'), configs.options);
	};

	abstract class SlugifyRepository extends base implements ISlugifyRepositoryMixin<E, ID, R> {
		constructor(...args: any[]) {
			super(...args);
		}

		// @ts-ignore
		async generateUniqueSlug(slug: string): Promise<string> {
			if (!slug) {
				throw new HttpErrors.FailedDependency('Slug configs is invalid');
			}

			const regex = slug === '0' ? new RegExp('^([0-9]+)$') : new RegExp(`^${slug}(-[0-9]+){0,2}$`);

			const where = { slug: { like: regex } } as any;

			const similarInstances = await super.find({ where });

			if (similarInstances.length > 0) {
				let maxCount = 0;
				forEach(similarInstances, (similarInstance: any) => {
					const match = similarInstance.slug.match(regex);
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

			return slug;
		}

		async findBySlug(
			slug: string,
			filter?: Filter<E>,
			options?: Options,
		): Promise<(E & R) | null> {
			const originalFilter = filter ?? {};

			const modifiedFilter = new SlugifyFilterBuilder(cloneDeep(originalFilter))
				.imposeCondition({
					slug,
				} as Condition<E>)
				.build();

			const entity = await super.findOne(modifiedFilter, options);

			if (!entity) {
				throw new HttpErrors.NotFound(
					`Not found with slug: ${slug}`,
				);
			}

			return entity;
		}

		// @ts-ignore
		async create(entity: DataObject<E>, options?: Options): Promise<E> {
			try {
				const slug: string = generateSlug(entity);

				entity.slug = await this.generateUniqueSlug(slug as string);

				return super.create(entity, options) as any;
			} catch (error) {
				// MongoError 11000 duplicate key
				if (error.code === 11000) {
					throw new HttpErrors.Conflict();
				} else {
					throw error;
				}
			}
		}

		// @ts-ignore
		async createAll(entities: DataObject<E>[], options?: Options): Promise<E[]> {
			await async.eachLimit(entities, 10, async (entity: DataObject<E>) => {
				const slug: string = generateSlug(entity);

				entity.slug = await this.generateUniqueSlug(slug);
			});

			return super.createAll(entities, options);
		}

		// @ts-ignore
		async save(entity: E, options?: Options): Promise<E> {
			const slug: string = generateSlug(entity);

			if (slug !== entity.slug) {
				entity.slug = await this.generateUniqueSlug(slug);
			} else {
				entity.slug = slug;
			}

			return super.save(entity, options);
		}

		// @ts-ignore
		async update(entity: E, options?: Options): Promise<void> {
			const slug: string = generateSlug(entity);

			if (slug !== entity.slug) {
				entity.slug = await this.generateUniqueSlug(slug);
			} else {
				entity.slug = slug;
			}

			return super.update(entity, options);
		}

		// @ts-ignore
		// async updateAll(
		// 	data: DataObject<E>,
		// 	where?: Where<E>,
		// 	options?: Options,
		// ): Promise<Count> {
		// 	// @ts-ignore
		// 	// data.slug = await this.generateUniqueSlug(data, where?.id);

		// 	return super.updateAll(data, where, options);
		// }

		// @ts-ignore
		async updateById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
			const item = await this.findById(id);
			if (!item) {
				throw new HttpErrors.NotFound(
					`Not found with id: ${id}`,
				);
			}

			const slug: string = generateSlug({ ...item, ...data });

			if (slug !== item.slug) {
				data.slug = await this.generateUniqueSlug(slug);
			} else {
				data.slug = item.slug;
			}

			return super.updateById(id, data, options);
		}

		// @ts-ignore
		async replaceById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
			const item = await this.findById(id);

			if (!item) {
				throw new HttpErrors.NotFound(
					`Not found with id: ${id}`,
				);
			}

			const slug: string = generateSlug({ ...item, ...data });

			if (slug !== item.slug) {
				data.slug = await this.generateUniqueSlug(slug);
			} else {
				data.slug = item.slug;
			}

			return super.replaceById(id, data, options);
		}
	}

	debug('DEV ~ file: SlugifyRepository.repository.mixin.ts:33 ~ base:', Object.getOwnPropertyNames(SlugifyRepository.prototype));
	return SlugifyRepository;
}
