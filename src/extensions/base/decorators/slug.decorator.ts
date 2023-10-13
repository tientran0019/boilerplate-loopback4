import { PropertyDecoratorFactory } from '@loopback/metadata';

export const MODEL_SLUG_KEY = 'slug';

export interface PropertyDefinition {
	field: string;
	options?: {
		replacement?: string;
		remove?: RegExp;
		lower?: boolean;
		strict?: boolean;
		locale?: string;
		trim?: boolean;
	};
}

/**
 * Decorator for model slug
 * @param definition
 * @returns A slug decorator
 */
export function slug(definition?: Partial<PropertyDefinition>) {
	return PropertyDecoratorFactory.createDecorator(
		MODEL_SLUG_KEY,
		Object.assign({}, definition),
		{ decoratorName: '@slug' },
	);
}
