/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 10:53:51

* Last updated on: 2023-10-06 10:53:51
* Last updated by: Tien Tran
*------------------------------------------------------- */
import {
	RefreshTokenService,
	RefreshTokenServiceBindings,
	TokenObject,
} from 'src/extensions/authentication-jwt';
import { inject } from '@loopback/core';
import {
	post,
	requestBody,
	SchemaObject,
} from '@loopback/rest';


// Describes the type of grant object taken in by method "refresh"
type RefreshGrant = {
	refreshToken: string;
};

// Describes the schema of grant object
const RefreshGrantSchema: SchemaObject = {
	type: 'object',
	required: ['refreshToken'],
	properties: {
		refreshToken: {
			type: 'string',
		},
	},
};

// Describes the request body of grant object
const RefreshGrantRequestBody = {
	description: 'Reissuing Acess Token',
	required: true,
	content: {
		'application/json': { schema: RefreshGrantSchema },
	},
};

export class RefreshTokenController {
	constructor(
		@inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
		public refreshService: RefreshTokenService,
	) { }

	@post('/refresh', {
		responses: {
			'200': {
				description: 'Token',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								accessToken: {
									type: 'object',
								},
							},
						},
					},
				},
			},
		},
	})
	async refresh(
		@requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
	): Promise<TokenObject> {
		return this.refreshService.refreshToken(refreshGrant.refreshToken);
	}
}
