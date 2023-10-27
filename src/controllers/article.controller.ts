/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-11 11:58:28

* Last updated on: 2023-10-11 11:58:28
* Last updated by: Tien Tran
*------------------------------------------------------- */
import {
	Count,
	CountSchema,
	Filter,
	FilterExcludingWhere,
	repository,
	Where,
} from '@loopback/repository';
import {
	post,
	param,
	get,
	getModelSchemaRef,
	patch,
	put,
	del,
	requestBody,
	response,
} from '@loopback/rest';
import { Article } from '../models';
import { ArticleRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

/* The ArticleController class is responsible for handling CRUD operations for the Article model. */
export class ArticleController {
	constructor(
		@repository(ArticleRepository)
		public articleRepository: ArticleRepository,
	) { }

	@authenticate('jwt')
	@post('/articles')
	@response(200, {
		description: 'Article model instance',
		content: { 'application/json': { schema: getModelSchemaRef(Article) } },
	})
	async create(
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(Article, {
						title: 'NewArticle',
						exclude: ['id'],
					}),
				},
			},
		})
		article: Omit<Article, 'id'>,
	): Promise<Article> {
		return this.articleRepository.create(article);
	}

	@get('/articles/count')
	@response(200, {
		description: 'Article model count',
		content: { 'application/json': { schema: CountSchema } },
	})
	async count(
		@param.where(Article) where?: Where<Article>,
	): Promise<Count> {
		return this.articleRepository.count(where);
	}

	@get('/articles')
	@response(200, {
		description: 'Array of Article model instances',
		content: {
			'application/json': {
				schema: {
					type: 'array',
					items: getModelSchemaRef(Article, { includeRelations: true }),
				},
			},
		},
	})
	async find(
		@param.filter(Article) filter?: Filter<Article>,
	): Promise<Article[]> {
		return this.articleRepository.find(filter);
	}

	@authenticate('jwt')
	@patch('/articles')
	@response(200, {
		description: 'Article PATCH success count',
		content: { 'application/json': { schema: CountSchema } },
	})
	async updateAll(
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(Article, { partial: true }),
				},
			},
		})
		article: Article,
		@param.where(Article) where?: Where<Article>,
	): Promise<Count> {
		return this.articleRepository.updateAll(article, where);
	}

	@get('/articles/{id}')
	@response(200, {
		description: 'Article model instance',
		content: {
			'application/json': {
				schema: getModelSchemaRef(Article, { includeRelations: true }),
			},
		},
	})
	async findById(
		@param.path.string('id') id: string,
		@param.filter(Article, { exclude: 'where' }) filter?: FilterExcludingWhere<Article>
	): Promise<Article> {
		return this.articleRepository.findById(id, filter);
	}

	@get('/articles/slug/{slug}')
	@response(200, {
		description: 'Article model instance',
		content: {
			'application/json': {
				schema: getModelSchemaRef(Article, { includeRelations: true }),
			},
		},
	})
	async findBySlug(
		@param.path.string('slug') slug: string,
		@param.filter(Article, { exclude: 'where' }) filter?: FilterExcludingWhere<Article>
	): Promise<Article | null> {
		return this.articleRepository.findBySlug(slug, filter);
	}

	@authenticate('jwt')
	@patch('/articles/{id}')
	@response(204, {
		description: 'Article PATCH success',
	})
	async updateById(
		@param.path.string('id') id: string,
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(Article, { partial: true }),
				},
			},
		})
		article: Article,
	): Promise<void> {
		await this.articleRepository.updateById(id, article);
	}

	@authenticate('jwt')
	@put('/articles/{id}')
	@response(204, {
		description: 'Article PUT success',
	})
	async replaceById(
		@param.path.string('id') id: string,
		@requestBody() article: Article,
	): Promise<void> {
		await this.articleRepository.replaceById(id, article, { admin: true });
	}

	@authenticate('jwt')
	@del('/articles/{id}')
	@response(204, {
		description: 'Article DELETE success',
	})
	async deleteById(@param.path.string('id') id: string): Promise<void> {
		await this.articleRepository.deleteById(id);
	}
}
