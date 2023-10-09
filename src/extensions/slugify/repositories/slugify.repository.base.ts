/* --------------------------------------------------------
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
// 1) src/repositories/default-transaction-slugify.repository.base.ts

import {
	DataObject,
	DefaultCrudRepository,
	Entity,
	Filter,
	juggler,
	Condition,
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import _, { cloneDeep } from 'lodash';
import { Options } from 'loopback-datasource-juggler';

import { SlugifyEntity } from '../models/slugify-entity';

import { SlugifyFilterBuilder } from '../utils/filter-builder';
import slugify from '../utils/slugify';
import { SlugifyRepositoryMixinOptions } from '../types';

export abstract class SlugifyRepository<
	E extends SlugifyEntity,
	ID,
	R extends object = {},
> extends DefaultCrudRepository<E, ID, R> {
	constructor(
		entityClass: typeof Entity & {
			prototype: E;
		},
		dataSource: juggler.DataSource,
		protected readonly configs: SlugifyRepositoryMixinOptions = {},
	) {
		super(entityClass, dataSource);
	}

	private async generateUniqueSlug(entity: DataObject<E & { slug: string, [key: string]: string | undefined }>): Promise<string> {
		let fields: string[] | string = this.configs?.fields ?? ['title'];
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

		let slug = slugify(input);

		const regex = slug === '0' ? new RegExp('^([0-9]+)$') : new RegExp(`^${slug}(-[0-9]+){0,2}$`);

		const where = { slug: { like: regex } } as any;

		const similarInstances = await super.find({ where });
		if (similarInstances.length > 0) {
			let maxCount = 0;
			_.forEach(similarInstances, (similarInstance: any) => {
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

	async create(entity: DataObject<E & { slug: string, [key: string]: string | undefined }>, options?: Options): Promise<E> {
		try {
			entity.slug = await this.generateUniqueSlug(entity);

			return super.create(entity, options) as any;
		} catch (error) {
			console.log('DEV ~ file: slugify.repository.base.ts:120 ~ create ~ error:', error);
			// MongoError 11000 duplicate key
			if (error.code === 11000) {
				throw new HttpErrors.Conflict();
			} else {
				throw error;
			}
		}
	}

	async save(entity: E, options?: Options): Promise<E> {
		entity.slug = await this.generateUniqueSlug(entity);

		return super.save(entity, options);
	}

	async update(entity: E, options?: Options): Promise<void> {
		entity.slug = await this.generateUniqueSlug(entity);

		return super.update(entity, options);
	}

	async updateById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
		const item = await this.findById(id);

		if (!item) {
			throw new HttpErrors.NotFound(
				`Not found with id: ${id}`,
			);
		}

		data.slug = await this.generateUniqueSlug({ ...item, ...data });

		return super.updateById(id, data, options);
	}

	async replaceById(id: ID, data: DataObject<E>, options?: Options): Promise<void> {
		const item = await this.findById(id);

		if (!item) {
			throw new HttpErrors.NotFound(
				`Not found with id: ${id}`,
			);
		}

		data.slug = await this.generateUniqueSlug({ ...item, ...data });

		return super.replaceById(id, data, options);
	}
}
