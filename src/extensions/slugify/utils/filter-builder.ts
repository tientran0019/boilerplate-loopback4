/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 22:34:36

* Last updated on: 2023-10-09 22:34:36
* Last updated by: Tien Tran
*------------------------------------------------------- */

import {
	AndClause,
	Condition,
	Filter,
	FilterBuilder,
	OrClause,
} from '@loopback/repository';

import { SlugifyEntity } from '../models/slugify-entity';

/**
 * A builder for Slugify crud filter.
 * Example
 *
 * ```ts
 * const filterBuilder = new SlugifyFilterBuilder(originalFilter)
 *    .imposeCondition({ deleted: false })
 *    .build();
 * ```
 */
export class SlugifyFilterBuilder<E extends SlugifyEntity> {
	filter: Filter<E>;

	constructor(originalFilter?: Filter<E>) {
		this.filter = originalFilter ?? {};
	}

	limit(limit: number) {
		this.filter.limit = new FilterBuilder(this.filter)
			.limit(limit)
			.build().limit;
		return this;
	}

	imposeCondition(conditionToEnsure: Condition<E>) {
		this.filter.where = this.filter.where ?? {};
		conditionToEnsure = conditionToEnsure ?? ({} as Condition<E>);

		const hasAndClause = (this.filter.where as AndClause<E>).and?.length > 0;
		const hasOrClause = (this.filter.where as OrClause<E>).or?.length > 0;

		if (hasAndClause) {
			(this.filter.where as AndClause<E>).and.push(conditionToEnsure);
		}
		if (hasOrClause) {
			this.filter.where = {
				and: [
					conditionToEnsure,
					{
						or: (this.filter.where as OrClause<E>).or,
					},
				],
			};
		}
		if (!(hasAndClause && hasOrClause)) {
			Object.assign(this.filter.where, conditionToEnsure);
		}
		return this;
	}

	build() {
		return this.filter;
	}
}
