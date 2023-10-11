import {
	inject,
	injectable,
	Interceptor,
	InvocationContext,
	InvocationResult,
	Provider,
	ValueOrPromise,
} from '@loopback/core';
import { SecurityBindings, UserProfile } from '@loopback/security';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({ tags: { key: TestInterceptor.BINDING_KEY } })
export class TestInterceptor implements Provider<Interceptor> {
	static readonly BINDING_KEY = `interceptors.${TestInterceptor.name}`;

	constructor(
		@inject(SecurityBindings.USER, { optional: true })
		public currentUser: UserProfile,
	) {}


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
	 * @param invocationCtx - Invocation context
	 * @param next - A function to invoke next interceptor or the target method
	 */
	async intercept(
		invocationCtx: InvocationContext,
		next: () => ValueOrPromise<InvocationResult>,
	) {
		try {
			console.log('DEV ~ file: test.interceptor.ts:42 ~ TestInterceptor ~ invocationCtx:', invocationCtx.args[0]);
			console.log('logSync: before-' + invocationCtx.methodName, this.currentUser);

			// console.log('-----', Article.definition.properties);

			// Calling `next()` without `await`
			const result = await next();
			console.log('DEV ~ file: test.interceptor.ts:52 ~ TestInterceptor ~ result:', result);
			// It's possible that the statement below is executed before downstream
			// interceptors or the target method finish
			console.log('logSync: after-' + invocationCtx.methodName);

			delete result.publishedDate;

			return result;
		} catch (err) {
			console.log('DEV ~ file: test.interceptor.ts:49 ~ TestInterceptor ~ err:', err);
			// Add error handling logic here
			throw err;
		}
	}
}
