/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 11:07:25

* Last updated on: 2023-10-09 11:07:25
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject, Getter, Constructor } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';

import { MongoDataSource } from 'src/datasources';
import { Category, CategoryRelations, User } from 'src/models';
import { UserRepository } from './user.repository';
import { SlugifyRepositoryMixin, SlugifyRepositoryMixinOptions } from 'src/extensions/slugify';

export class CategoryRepository extends SlugifyRepositoryMixin<
	Category,
	typeof Category.prototype.id,
	Constructor<
		DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations>
	>
>(DefaultCrudRepository) {

	public readonly creator: BelongsToAccessor<User, typeof Category.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		protected readonly configs: SlugifyRepositoryMixinOptions = { fields: ['name'] },

	) {
		super(Category, dataSource);
		this.creator = this.createBelongsToAccessorFor('creator', userRepositoryGetter,);
		this.registerInclusionResolver('creator', this.creator.inclusionResolver);
	}
}
