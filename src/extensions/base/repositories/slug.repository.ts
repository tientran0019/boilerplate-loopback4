import { MetadataInspector, MixinTarget } from '@loopback/core';
import { Entity, EntityCrudRepository, PropertyMap } from '@loopback/repository';
import slugify from '../utils/slugify';
import { MODEL_SLUG_KEY, PropertyDefinition } from '../decorators/slug.decorator';
import debugFactory from 'debug';

export const debug = debugFactory('loopback:slug');

/* eslint-disable @typescript-eslint/ban-ts-comment */
export function SlugRepositoryMixin<T extends Entity, Relations extends object>() {
	return function <R extends MixinTarget<EntityCrudRepository<T, string, Relations>>>(superClass: R) {
		class SlugRepository extends superClass {
			definePersistedModel(entityClass: typeof Entity) {
				debug('Execute method "definePersistedModel()"');
				// @ts-ignore
				const modelClass = super.definePersistedModel(entityClass);
				// @ts-ignore
				modelClass.observe('before save', async ctx => {
					if (ctx.instance) {
						debug('Run "before save" script');
						const propertyMap: PropertyMap = MetadataInspector.getAllPropertyMetadata<PropertyDefinition>(MODEL_SLUG_KEY, entityClass.prototype) ?? {};

						for (const [propName, propDef] of Object.entries(propertyMap)) {
							debug('Generate slug from field "%s" to field "%s"', propDef.field, propName);
							ctx.instance[propName] = slugify(ctx.instance[propDef.field], propDef.options);
						}
					}
				});
				return modelClass;
			}
		}

		return SlugRepository;
	};
}

