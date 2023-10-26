/** --------------------------------------------------------
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
import { SlugifyRepositoryMixin } from 'src/extensions/slugify';
import { TimestampRepositoryMixin } from 'src/extensions/timestamp';
import { SecurityBindings, UserProfile } from '@loopback/security';

const TimestampMixin = TimestampRepositoryMixin<
	Category,
	typeof Category.prototype.id,
	Constructor<
		DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations>
	>
>(
	DefaultCrudRepository,
);

export class CategoryRepository extends SlugifyRepositoryMixin<
	Category,
	typeof Category.prototype.id,
	Constructor<
		DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations>
	>
>(
	TimestampMixin,
	{
		fields: ['name'],
	}
) {
	public readonly createdBy: BelongsToAccessor<User, typeof Category.prototype.id>;
	public readonly lastUpdatedBy: BelongsToAccessor<User, typeof Category.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		@inject(SecurityBindings.USER, { optional: true })
		public currentUser: UserProfile,
	) {
		super(Category, dataSource);

		this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
		this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);

		this.lastUpdatedBy = this.createBelongsToAccessorFor('lastUpdatedBy', userRepositoryGetter,);
		this.registerInclusionResolver('lastUpdatedBy', this.lastUpdatedBy.inclusionResolver);
	}
}
