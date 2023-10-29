/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 17:08:23

* Last updated on: 2023-10-29 21:56:52
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Constructor, inject } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { TimestampRepositoryMixin } from 'src/extensions/timestamp';
import { RefreshToken, RefreshTokenRelations } from 'src/models';

export class RefreshTokenRepository extends TimestampRepositoryMixin<
	RefreshToken,
	typeof RefreshToken.prototype.id,
	Constructor<
		DefaultCrudRepository<RefreshToken, typeof RefreshToken.prototype.id, RefreshTokenRelations>
	>
>(
	DefaultCrudRepository,
	{
		userTracking: false,
	}
) {
	constructor(@inject('datasources.mongo') dataSource: juggler.DataSource) {
		super(RefreshToken, dataSource);
	}
}
