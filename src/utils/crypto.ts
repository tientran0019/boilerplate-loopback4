/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-05 22:17:35

* Last updated on: 2023-10-05 22:17:35
* Last updated by: Tien Tran
*------------------------------------------------------- */

import CryptoJS from 'crypto-js';

/**
 * The function encrypts data using AES encryption with a secret key.
 *
 * @param {any} data - The `data` parameter is the data that you want to encrypt. It can be of any
 * type, but it will be converted to a JSON string before encryption.
 * @param {string} [secretKey] - The `secretKey` parameter is a string that is used as the encryption
 * key. It is used to encrypt the `data` parameter using the AES encryption algorithm.
 * @returns a string.
 */
export const encrypt = (data: any, secretKey?: string): string => {
	if (!data || !secretKey) {
		throw new Error('SecretKey and data are required');
	}
	try {
		return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
	} catch (error) {
		throw new Error('Bad Request');
	}
};

/**
 * The function decrypts a given data using a secret key and returns the decrypted result.
 *
 * @param {string} data - The `data` parameter is a string that represents the encrypted data that you
 * want to decrypt.
 * @param {string} [secretKey] - The secretKey parameter is a string that is used as the key to decrypt
 * the data. It should be a secret and known only to the authorized parties.
 * @returns the decrypted data as a JavaScript object.
 */
export const decrypt = (data: string, secretKey?: string): any => {
	if (!data || !secretKey) {
		throw new Error('SecretKey and data are required');
	}
	try {
		const bytes = CryptoJS.AES.decrypt(data, secretKey);
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	} catch (error) {
		throw new Error('Bad Request');
	}
};
