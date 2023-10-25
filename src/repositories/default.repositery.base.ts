import { MixinTarget } from '@loopback/core';
import { CrudRepository, Entity, Model } from '@loopback/repository';
import { SoftCrudRepository, SoftDeleteEntity } from 'loopback4-soft-delete';
import { SlugifyEntity, SlugifyRepository, SlugifyRepositoryMixin } from 'src/extensions/slugify';
import { TimestampEntity, TimestampRepository, TimestampRepositoryMixin } from 'src/extensions/timestamp';

// export abstract class DefaultSlugifyRepository<
// 	T extends SlugifyEntity,
// 	ID,
// 	Relations extends object = {},
// > extends SlugifyRepository<T, ID, Relations> { }

// export abstract class DefaultRepository<
// 	T extends Entity,
// 	ID,
// 	Relations extends object = {},
// > extends DefaultSlugifyRepository<T, ID, Relations> { }

// export default function CompositionMixin<
// 	T extends Model,
// 	R extends MixinTarget<CrudRepository<T>>
// >(superClass: R) {
// 	//ts-ignore
// 	return TimestampRepositoryMixin(SlugifyRepositoryMixin(superClass));
// }
