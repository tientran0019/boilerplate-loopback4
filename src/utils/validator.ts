/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-05 22:54:38

* Last updated on: 2023-10-05 22:54:38
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { HttpErrors } from '@loopback/rest';

export function validateKeyPassword(keyAndPassword: any) {
	// Validate Password Length
	if (!keyAndPassword.password || keyAndPassword.password.length < 8) {
		throw new HttpErrors.UnprocessableEntity(
			'password must be minimum 8 characters',
		);
	}

	if (keyAndPassword.password !== keyAndPassword.confirmPassword) {
		throw new HttpErrors.UnprocessableEntity(
			'password and confirmation password do not match',
		);
	}

	if (
		keyAndPassword.resetKey.length === 0 ||
		keyAndPassword.resetKey.trim() === ''
	) {
		throw new HttpErrors.UnprocessableEntity('reset key is mandatory');
	}
}
