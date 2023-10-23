import { PropertyDecoratorFactory } from '@loopback/metadata';

import { SlugifyOptions } from '../utils/slugify';

export const MODEL_SLUG_KEY = 'metadata-key-model-property-slug';

export type PropertyDefinition = {
	fields: string | string[];
	options?: SlugifyOptions;
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
