/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:36:49

* Last updated on: 2023-10-09 22:36:49
* Last updated by: Tien Tran
*------------------------------------------------------- */

/**
 * A Class decorator that takes in one or more classes and extends the prototype of a target class with the properties and methods from the provided classes.
 * @param classes One or more classes whose prototype will be extended onto the target class.
 */
export default function extendPrototype(
	...classes: unknown & { prototype: unknown }[]
) {
	return function (target: unknown & { prototype: unknown }) {
		classes.forEach(mixin => {
			Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
				Object.defineProperty(
					target.prototype,
					name,
					Object.getOwnPropertyDescriptor(mixin.prototype, name) ??
					Object.create(null),
				);
			});
		});
	};
}
