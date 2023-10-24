/** --------------------------------------------------------
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
 *
*	The provided TypeScript code defines a function called extendPrototype with the purpose of extending a class by adding properties and methods from one or more mixins. Here's a detailed explanation of how the code works:
*
*	The extendPrototype function takes a list of parameters represented by the classes variable. In a general sense, classes is an array of objects or classes (potentially with prototypes).
*
*	The extendPrototype function returns another inner function that takes a target parameter, representing the class you want to extend.
*
*	Inside the returned function, extendPrototype uses a forEach loop to iterate through each element in the classes array. Each element in the array represents a mixin.
*
*	Within the forEach loop, the code extracts all properties and methods from mixin.prototype by using Object.getOwnPropertyNames(mixin.prototype). This allows you to extract a list of components present in the mixin.
*
*	For each component, the code uses Object.defineProperty to redefine it on target.prototype. This is equivalent to copying the components from the mixin to the target class, effectively extending the target class with these components.
*
*	Object.getOwnPropertyDescriptor(mixin.prototype, name) is used to retrieve information about a property or method from the mixin. If the component doesn't exist on the mixin, it will return undefined.
*	Object.create(null) is used to create an empty object (with no prototype) if Object.getOwnPropertyDescriptor returns undefined. This ensures that components from the mixin will be added to target.prototype even if they don't exist on the mixin.
*	In the end, after the loop is executed, target.prototype will include all the components from the mixins, thus extending the target class by combining components from various mixins.
 * @param classes One or more classes whose prototype will be extended onto the target class.
 */
export default function extendPrototype(
	configs = {},
	...classes: unknown & { prototype: unknown }[]
) {
	console.log('DEV ~ file: extend-timestamp.ts:36 ~ configs:', configs);
	return function (target: unknown & { prototype: unknown }) {
		classes.forEach(mixin => {
			Object.defineProperty(
				target.prototype,
				'configs',
				{
					value: configs,
				},
			);
			Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
				Object.defineProperty(
					target.prototype,
					name,
					Object.getOwnPropertyDescriptor(mixin.prototype, name) ?? Object.create(null),
				);
			});
		});
	};
}
