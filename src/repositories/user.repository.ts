/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 17:12:10

* Last updated on: 2023-10-06 17:12:10
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Constructor, Getter, inject } from '@loopback/core';
import {
	DefaultCrudRepository,
	HasOneRepositoryFactory,
	juggler,
	repository,
} from '@loopback/repository';

import { User, UserCredentials, UserRelations } from 'src/models';

import { UserCredentialsRepository } from './user-credentials.repository';
import { TimestampRepositoryMixin } from 'src/extensions/timestamp';

export class UserRepository extends TimestampRepositoryMixin<
	User,
	typeof User.prototype.id,
	Constructor<
		DefaultCrudRepository<User, typeof User.prototype.id, UserRelations>
	>
>(
	DefaultCrudRepository,
	{
		userTracking: false,
	}
) {
	public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

	constructor(
		@inject('datasources.mongo')
		dataSource: juggler.DataSource,
		@repository.getter('UserCredentialsRepository')
		protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
	) {
		super(User, dataSource);
		this.userCredentials = this.createHasOneRepositoryFactoryFor(
			'userCredentials',
			userCredentialsRepositoryGetter,
		);
		this.registerInclusionResolver(
			'userCredentials',
			this.userCredentials.inclusionResolver,
		);
	}

	async findCredentials(
		userId: typeof User.prototype.id,
	): Promise<UserCredentials | undefined> {
		try {
			return await this.userCredentials(userId).get();
		} catch (err) {
			if (err.code === 'ENTITY_NOT_FOUND') {
				return undefined;
			}
			throw err;
		}
	}
}
