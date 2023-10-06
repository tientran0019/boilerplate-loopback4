/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-06 16:21:01

* Last updated on: 2023-10-06 16:21:01
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Model, model, property } from '@loopback/repository';

@model()
export class EmailTemplate extends Model {
	@property({
		type: 'string',
	})
	from = 'no_reply@simplizetrip.com';

	@property({
		type: 'string',
		required: true,
	})
	to: string;

	@property({
		type: 'string',
		required: true,
	})
	subject: string;

	@property({
		type: 'string',
		required: true,
	})
	text: string;

	@property({
		type: 'string',
		required: true,
	})
	html: string;

	constructor(data?: Partial<EmailTemplate>) {
		super(data);
	}
}

export interface EmailTemplateRelations {
	// describe navigational properties here
}

export type EmailTemplateWithRelations = EmailTemplate & EmailTemplateRelations;
