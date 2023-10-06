import { inject } from '@loopback/core';
import { DefaultKeyValueRepository } from '@loopback/repository';

import { RedisDataSource } from 'src/datasources';

import { RevokedToken } from 'src/models';

export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
	constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
		super(RevokedToken, dataSource);
	}
}
