// import { MixinTarget } from '@loopback/core';
// import { CrudRepository, DefaultCrudRepository, Entity, Model } from '@loopback/repository';
// import { SoftCrudRepository, SoftDeleteEntity } from 'loopback4-soft-delete';
// import { SlugifyEntity, SlugifyRepository, SlugifyRepositoryMixin } from 'src/extensions/slugify';
// import { TimestampEntity, TimestampRepository, TimestampRepositoryMixin } from 'src/extensions/timestamp';
// import { PaginationRepositoryMixin } from 'src/extensions/pagination';

// export function MyProjectRepositoryMixin<
// 	E extends Entity,
// 	ID,
// 	T extends MixinTarget<DefaultCrudRepository<E, ID, R>>,
// 	R extends object = {},
// >(superClass: R) {
// 	return PaginationRepositoryMixin(TimestampRepositoryMixin(SlugifyRepositoryMixin(superClass)));
// }

