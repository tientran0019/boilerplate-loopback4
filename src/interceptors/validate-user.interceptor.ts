/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-08 17:40:17

* Last updated on: 2023-10-08 17:40:17
* Last updated by: Tien Tran
*------------------------------------------------------- */
// HOW TO USE
// Add this line to apply interceptor to this class or method
// @intercept(ValidatePhoneNumInterceptor.BINDING_KEY)

import {
	injectable,
	Interceptor,
	InvocationContext,
	InvocationResult,
	Provider,
	ValueOrPromise,
} from '@loopback/core';
import { User } from 'src/models';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({ tags: { key: ValidateUserInterceptor.BINDING_KEY } })
export class ValidateUserInterceptor implements Provider<Interceptor> {
	static readonly BINDING_KEY = `interceptors.${ValidateUserInterceptor.name}`;

	/*
	constructor() {}
	*/

	/**
	 * This method is used by LoopBack context to produce an interceptor function
	 * for the binding.
	 *
	 * @returns An interceptor function
	 */
	value() {
		return this.intercept.bind(this);
	}

	/**
	 * The logic to intercept an invocation
	 * It checks the area code of the phone number to make sure it matches
	 * the provided city name.
	 * @param invocationCtx - Invocation context
	 * @param next - A function to invoke next interceptor or the target method
	 */
	async intercept(
		invocationCtx: InvocationContext,
		next: () => ValueOrPromise<InvocationResult>,
	) {
		// Add pre-invocation logic here
		let user: User | undefined;

		if (invocationCtx.methodName === 'create') user = invocationCtx.args[0];
		else if (invocationCtx.methodName === 'updateById') user = invocationCtx.args[1];

		if (
			user &&
			!this.isAreaCodeValid(user.phone!, user.country!)
		) {
			const err: ValidationError = new ValidationError(
				'Area code and city do not match',
			);
			err.statusCode = 400;
			throw err;
		}

		const result = await next();
		// Add post-invocation logic here
		return result;
	}

	isAreaCodeValid(phoneNum: string, country: string): Boolean {
		// add some dummy logic here
		const areaCode: string = phoneNum.slice(0, 3);

		if (country.toLowerCase() === 'toronto')
			return areaCode === '416' || areaCode === '647';

		// it always returns true for now
		return true;
	}
}

class ValidationError extends Error {
	code?: string;
	statusCode?: number;
}
/*
try {
	// Add pre-invocation logic here
	// Code from beforeRemote hooks go here
	console.log('About to invoke a method.');
	const result = await next();
	// Add post-invocation logic here
	// Code from afterRemote hooks go here
	console.log('Method finished.');
	return result;
} catch (err) {
	// Add error handling logic here
	// Code from afterRemoteError hooks go here
	console.log('Method failed: ', err);
	throw err;
} */
