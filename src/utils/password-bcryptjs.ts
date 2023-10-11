/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-05 22:53:46

* Last updated on: 2023-10-05 22:53:46
* Last updated by: Tien Tran
*------------------------------------------------------- */

import bcryptjs from 'bcryptjs';

/**
 * The function `hashPassword` takes a password and number of rounds as input and returns a hashed
 * password using bcryptjs.
 * @param {string} password - The password parameter is a string that represents the password that
 * needs to be hashed.
 * @param {number} [rounds=10] - The "rounds" parameter is an optional parameter that specifies the
 * number of rounds to use when generating the salt. The higher the number of rounds, the more secure
 * the generated hash will be, but it will also take longer to compute. By default, if no value is
 * provided for "rounds
 * @returns a Promise that resolves to a string.
 */
export async function hashPassword(
	password: string,
	rounds: number = 10,
): Promise<string> {
	const salt = await bcryptjs.genSalt(rounds);
	return bcryptjs.hash(password, salt);
}

/**
 * The function compares a provided password with a stored password and returns a boolean indicating
 * whether they match.
 * @param {string} providedPass - The provided password that the user entered.
 * @param {string} storedPass - The `storedPass` parameter is the password that is stored in your
 * system, typically in a database or some other form of storage. It is the password that you want to
 * compare with the `providedPass` parameter to check if they match.
 * @returns a Promise that resolves to a boolean value indicating whether the provided password matches
 * the stored password.
 */
export async function comparePassword(
	providedPass: string,
	storedPass: string,
): Promise<boolean> {
	const passwordIsMatched = await bcryptjs.compare(providedPass, storedPass);
	return passwordIsMatched;
}
