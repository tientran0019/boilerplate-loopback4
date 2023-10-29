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
import { SlugifyRepositoryMixin } from 'src/extensions/slugify';
import { TimestampRepositoryMixin } from 'src/extensions/timestamp';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { CategoryRepository } from './category.repository';
import { PaginationRepositoryMixin } from 'src/extensions/pagination';


const TimestampMixin = TimestampRepositoryMixin<
	Article,
	typeof Article.prototype.id,
	Constructor<
		DefaultCrudRepository<Article, typeof Article.prototype.id, ArticleRelations>
	>
>(
	DefaultCrudRepository,
	{
		userTracking: true,
		throwIfNoUser: true,
		createdField: 'createdById',
		updatedField: 'lastUpdatedById',
	}
);

const PaginationMixin = PaginationRepositoryMixin<
	Article,
	typeof Article.prototype.id,
	Constructor<
		DefaultCrudRepository<Article, typeof Article.prototype.id, ArticleRelations>
	>
>(
	TimestampMixin,
);

export class ArticleRepository extends SlugifyRepositoryMixin<
	Article,
	typeof Article.prototype.id,
	Constructor<
		DefaultCrudRepository<Article, typeof Article.prototype.id, ArticleRelations>
	>
>(
	PaginationMixin,
	{
		fields: ['title'],
	}
) {
	public readonly createdBy: BelongsToAccessor<User, typeof Article.prototype.id>;
	public readonly lastUpdatedBy: BelongsToAccessor<User, typeof Article.prototype.id>;

	public readonly category: BelongsToAccessor<Category, typeof Article.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		@repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
		@inject(SecurityBindings.USER, { optional: true })
		public currentUser: UserProfile,
	) {
		super(Article, dataSource);
		this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
		this.registerInclusionResolver('category', this.category.inclusionResolver);

		this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter,);
		this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);

		this.lastUpdatedBy = this.createBelongsToAccessorFor('lastUpdatedBy', userRepositoryGetter,);
		this.registerInclusionResolver('lastUpdatedBy', this.lastUpdatedBy.inclusionResolver);
	}
}
