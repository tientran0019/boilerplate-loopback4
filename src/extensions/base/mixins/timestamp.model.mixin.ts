import { MixinTarget } from '../types';
import { Model, property } from '@loopback/repository';

export function TimestampModelMixin<T extends MixinTarget<Model>>(superClass: T) {
	class MixedModel extends superClass implements TimestampModel {
		@property({
			type: 'number',
			default: () => +new Date(),
			index: true,
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
		})
		createdAt: number;

		@property({
			type: 'number',
			index: true,
			updateOnly: true, // Update only when the model is updated
			jsonSchema: {
				readOnly: true,
				pattern: /^\d{13}$/.source,
				errorMessage: {
					pattern: 'Invalid timestamp',
				},
			},
		})
		updatedAt: number;
	}

	return MixedModel;
}

export interface TimestampModel {
	createdAt?: number;
	updatedAt?: number;
}
