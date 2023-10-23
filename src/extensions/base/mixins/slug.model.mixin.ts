import { MixinTarget } from '../types';
import { Model, property } from '@loopback/repository';

export function SlugModelMixin<T extends MixinTarget<Model>>(superClass: T) {
	class MixedModel extends superClass implements SlugModel {
		@property({
			type: 'string',
		})
		slug?: string;
	}

	return MixedModel;
}

export interface SlugModel {
	slug?: string;
}
