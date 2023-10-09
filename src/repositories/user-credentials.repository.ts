/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 11:09:30

* Last updated on: 2023-10-09 11:09:30
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { UserCredentials, UserCredentialsRelations } from 'src/models';

export class UserCredentialsRepository extends DefaultCrudRepository<
	UserCredentials,
	typeof UserCredentials.prototype.id,
	UserCredentialsRelations
> {
	constructor(@inject('datasources.mongo') dataSource: juggler.DataSource) {
		super(UserCredentials, dataSource);
	}
}
