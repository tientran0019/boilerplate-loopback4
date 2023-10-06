/* --------------------------------------------------------
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

export const generateOtp = (length = 6, options = { upperCase: false, alphabets: false, specialChars: false }) => {
	const ttl = process.env.OTP_EXPIRES_IN ?? 0;

	return {
		code: otpGenerator.generate(length, options),
		ttl,
		iat: +new Date(),
		exp: +ttl + (+new Date()),
	};
};

export const generateVerificationKey = (payload: any): string => {
	const key = encrypt(payload, process.env.OTP_SECRET);

	return key;
};

export const parseVerificationKey = (key: string): any => {
	const payload = decrypt(key, process.env.OTP_SECRET);

	return payload;
};

export default {
	generateOtp,
	generateVerificationKey,
	parseVerificationKey,
};
