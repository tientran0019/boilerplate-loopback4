/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 17:24:14

* Last updated on: 2023-10-09 17:24:14
* Last updated by: Tien Tran
*------------------------------------------------------- */

/**
 * The interceptor likes the remoting hook in lb3
 * https://loopback.io/doc/en/lb4/migration-models-remoting-hooks.html#modifying-request-parameters
 *
 * lb4 interceptor
 *
 *  app.beforeRemote('**', function logBefore(ctx, next) {
		console.log('About to invoke a method.');
		next();
	});

	app.afterRemote('**', function logAfter(ctx, next) {
		console.log('Method finished.');
		next();
	});

	app.afterRemoteError('**', function logAfterError(ctx, next) {
		console.log('Method failed: ', ctx.error);
	});

	These three hooks can be converted into a single interceptor in LoopBack 4.

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
	}

 * Global remoting hooks should be rewritten to global interceptors.
 * https://loopback.io/doc/en/lb4/Interceptor.html#global-interceptors
 * */

export * from './validate-user.interceptor';
