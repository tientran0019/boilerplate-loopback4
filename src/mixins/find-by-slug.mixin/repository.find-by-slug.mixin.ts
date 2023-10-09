/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 09:37:44

* Last updated on: 2023-10-09 09:37:44
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { MixinTarget } from '@loopback/core';
import { DefaultCrudRepository, Where, Entity, FilterExcludingWhere, Options, DataObject } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import _ from 'lodash';

import slugify from 'src/utils/slugify';

/**
 * An interface to allow finding notes by slug
 */
export interface FindBySlugRepository<E extends Entity, Relations extends object = {}> {
	createWithSlug(entity: DataObject<E & { slug?: string, [key: string]: string | undefined }>, options?: Options): Promise<E>;
	findBySlug(slug: string, filter?: FilterExcludingWhere<E>, options?: Options): Promise<(E & Relations) | null>;
}

export interface FindBySlugRepositoryMixinOptions {
	fields?: string[] | string,
}

export function FindBySlugRepositoryMixin<
	E extends Entity,
	R extends MixinTarget<DefaultCrudRepository<E, string>>,
	Relations extends object = {},
>(
	superClass: R,
	options: FindBySlugRepositoryMixinOptions = {},
) {
	class MixedRepositoryClass extends superClass implements FindBySlugRepository<E, Relations> {
		async createWithSlug(entity: DataObject<E & { slug?: string, [key: string]: string | undefined }>, opts?: Options): Promise<E> {
			let fields: string[] | string = options.fields ?? ['title'];
			if (_.isString(fields)) {
				fields = [fields];
			}

			const input = _.join(
				_.filter(_.map(fields, (field: string) => entity[field])),
				'_',
			).toLowerCase();


			let slug = slugify(input);

			const regex = slug === '0' ? new RegExp('^([0-9]+)$') : new RegExp(`^${slug}(-[0-9]+){0,2}$`);

			const where = { slug: { like: regex } } as any;

			const similarInstances = await this.find({ where });
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

			entity.slug = slug;

			return this.create(entity, opts);
		}

		async findBySlug(
			slug: string,
			filter?: FilterExcludingWhere<E>,
			opts?: Options,
		): Promise<(E & Relations) | null> {
			const where = { slug } as Where<E>;

			const foundItem = await this.findOne(
				{
					...filter,
					where,
				},
				opts,
			);

			if (!foundItem) {
				throw new HttpErrors.NotFound(
					`Not found with slug: ${slug}`,
				);
			}

			return foundItem as any;
		}
	}
	return MixedRepositoryClass;
}
