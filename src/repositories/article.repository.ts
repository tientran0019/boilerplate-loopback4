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
import { DefaultCrudRepository, repository, BelongsToAccessor, Entity } from '@loopback/repository';

import { MongoDataSource } from 'src/datasources';
import { User, Category, Article, ArticleRelations } from '../models';
import { UserRepository } from './user.repository';
import { CategoryRepository } from './category.repository';
import { SlugifyRepositoryMixin, SlugifyRepositoryOptions } from 'src/extensions/slugify';
import { TimestampEntity, TimestampRepository } from 'src/extensions/timestamp';
import { SlugRepository, SlugRepositoryMixin } from 'src/extensions/base/mixins/slug.repository.mixin';
import { mixin } from 'src/extensions/base/decorators/mixin.decorator';
import { TimestampRepositoryMixin } from 'src/extensions/base/mixins/timestamp.repository.mixin';
import { SlugModel } from 'src/extensions/base/mixins/slug.model.mixin';


// @mixin(TimestampRepositoryMixin)
// @mixin(SlugRepositoryMixin())
export class ArticleRepository extends DefaultCrudRepository<
	Article,
	typeof Article.prototype.id,
	ArticleRelations
> {

	public readonly creator: BelongsToAccessor<User, typeof Article.prototype.id>;

	public readonly category: BelongsToAccessor<Category, typeof Article.prototype.id>;

	constructor(
		@inject('datasources.mongo') dataSource: MongoDataSource,
		@repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
		@repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
	) {
		super(Article, dataSource);
		this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
		this.registerInclusionResolver('category', this.category.inclusionResolver);
		this.creator = this.createBelongsToAccessorFor('creator', userRepositoryGetter,);
		this.registerInclusionResolver('creator', this.creator.inclusionResolver);
	}
}

export interface ArticleRepository extends SlugRepository<Article, typeof Article.prototype.id, ArticleRelations> {}
