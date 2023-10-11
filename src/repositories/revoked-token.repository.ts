/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 11:09:22

* Last updated on: 2023-10-09 11:09:22
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { inject } from '@loopback/core';
import { DefaultKeyValueRepository } from '@loopback/repository';

import { RedisDataSource } from 'src/datasources';

import { RevokedToken } from 'src/models';

export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
	constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
		super(RevokedToken, dataSource);
	}
}
