/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:57:37

* Last updated on: 2023-10-06 16:57:37
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Entity, model, property } from '@loopback/repository';

@model()
export class RevokedToken extends Entity {
	@property({
		type: 'string',
		id: true,
		required: true,
	})
	token: string;

	constructor(data?: Partial<RevokedToken>) {
		super(data);
	}
}
