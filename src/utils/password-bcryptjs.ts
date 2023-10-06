/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-05 22:53:46

* Last updated on: 2023-10-05 22:53:46
* Last updated by: Tien Tran
*------------------------------------------------------- */

import bcryptjs from 'bcryptjs';

export async function hashPassword(
	password: string,
	rounds: number = 10,
): Promise<string> {
	const salt = await bcryptjs.genSalt(rounds);
	return bcryptjs.hash(password, salt);
}

export async function comparePassword(
	providedPass: string,
	storedPass: string,
): Promise<boolean> {
	const passwordIsMatched = await bcryptjs.compare(providedPass, storedPass);
	return passwordIsMatched;
}
