/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 17:08:23

* Last updated on: 2023-10-06 17:08:23
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { RefreshToken, RefreshTokenRelations } from 'src/models';

export class RefreshTokenRepository extends DefaultCrudRepository<
	RefreshToken,
	typeof RefreshToken.prototype.id,
	RefreshTokenRelations
> {
	constructor(@inject('datasources.mongo') dataSource: juggler.DataSource) {
		super(RefreshToken, dataSource);
	}
}
