/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-05 22:57:05

* Last updated on: 2023-10-05 22:57:05
* Last updated by: Tien Tran
*------------------------------------------------------- */

import otpGenerator from 'otp-generator';

import { encrypt, decrypt } from 'src/utils/crypto';

export interface OtpOptions {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
}

export interface OtpObject {
	code: string,
	ttl: number,
	iat: number,
	exp: number,
}


/**
 * The code exports functions to generate OTP, generate a verification key, and parse a verification
 * key.
 * @param {number} [length=6] - The `length` parameter is used to specify the length of the generated
 * OTP (One-Time Password). By default, it is set to 6 digits.
 * @param {OtpOptions} options - The `options` parameter is an object that can have the following
 * properties:
 * @returns The code is returning an object of type `OtpObject` which contains the following
 * properties:
 * - `code`: a string representing the generated OTP code
 * - `ttl`: a number representing the time to live (expires in) for the OTP code
 * - `iat`: a number representing the timestamp when the OTP code was generated
 * - `exp`: a number representing the timestamp when the OTP code
 */
export const generateOtp = (length: number = 6, options: OtpOptions = { digits: true }): OtpObject => {
	const ttl = +(process.env.OTP_EXPIRES_IN ?? 0);

	return {
		code: otpGenerator.generate(length, options),
		ttl,
		iat: +new Date(),
		exp: +ttl + (+new Date()),
	};
};

/**
 * The function generates a verification key by encrypting a payload using an OTP secret.
 * @param {any} payload - The payload parameter is the data that you want to encrypt and generate a
 * verification key for. It can be any type of data, such as a string, object, or array.
 * @returns a string, which is the encrypted verification key generated from the payload using the
 * OTP_SECRET environment variable.
 */
export const generateVerificationKey = (payload: any): string => {
	const key = encrypt(payload, process.env.OTP_SECRET);

	return key;
};

/**
 * The function `parseVerificationKey` takes a string `key` as input, decrypts it using the OTP secret
 * from the environment variables, and returns the decrypted payload.
 * @param {string} key - The `key` parameter is a string that represents the verification key that
 * needs to be parsed.
 * @returns the payload, which is the result of decrypting the key using the OTP_SECRET from the
 * environment variables.
 */
export const parseVerificationKey = (key: string): any => {
	const payload = decrypt(key, process.env.OTP_SECRET);

	return payload;
};

export default {
	generateOtp,
	generateVerificationKey,
	parseVerificationKey,
};
