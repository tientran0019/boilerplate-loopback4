/* --------------------------------------------------------
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
import { CategoryRepository } from './category.repository';
import { SlugifyRepositoryMixin, SlugifyRepositoryMixinOptions } from 'src/extensions/slugify';

export class ArticleRepository extends SlugifyRepositoryMixin<
	Article,
	typeof Article.prototype.id,
	Constructor<
		DefaultCrudRepository<Article, typeof Article.prototype.id, ArticleRelations>
	>
>(DefaultCrudRepository) {

	public readonly creator: BelongsToAccessor<User, typeof Article.prototype.id>;

	public readonly category: BelongsToAccessor<Category, typeof Article.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		@repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
		protected readonly configs: SlugifyRepositoryMixinOptions = { fields: ['title'] },
	) {
		super(Article, dataSource, configs);
		this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
		this.registerInclusionResolver('category', this.category.inclusionResolver);
		this.creator = this.createBelongsToAccessorFor('creator', userRepositoryGetter,);
		this.registerInclusionResolver('creator', this.creator.inclusionResolver);
	}
}
