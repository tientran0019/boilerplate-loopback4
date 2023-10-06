import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/context';
import { UserProfile, securityId } from '@loopback/security';
import _ from 'lodash';
import { AUTHENTICATED, EVERYONE, OWNER, UNAUTHENTICATED } from '../types';


export class MyAuthorizationProvider implements Provider<Authorizer> {
	constructor() { }

	/**
	 * @returns authenticateFn
	 */
	value(): Authorizer {
		return this.authorize.bind(this);
	}

	async authorize(
		authorizationCtx: AuthorizationContext,
		metadata: AuthorizationMetadata,
	): Promise<AuthorizationDecision> {
		const { allowedRoles, deniedRoles } = metadata;

		if (deniedRoles?.includes(EVERYONE)) {
			return AuthorizationDecision.DENY;
		}

		if (allowedRoles?.includes(EVERYONE)) {
			return AuthorizationDecision.ALLOW;
		}

		// No access if authorization details are missing
		let currentUser: UserProfile;

		if (authorizationCtx.principals.length > 0) {
			const user = _.pick(authorizationCtx.principals[0], [
				'id',
				'name',
				'role',
			]);
			currentUser = { [securityId]: user.id, name: user.name, role: user.role };

			if (deniedRoles?.includes(AUTHENTICATED)) {
				return AuthorizationDecision.DENY;
			}

			if (allowedRoles?.includes(AUTHENTICATED)) {
				return AuthorizationDecision.ALLOW;
			}
		} else {
			if (deniedRoles?.includes(UNAUTHENTICATED)) {
				return AuthorizationDecision.DENY;
			}

			if (allowedRoles?.includes(UNAUTHENTICATED)) {
				return AuthorizationDecision.ALLOW;
			}
			return AuthorizationDecision.DENY;
		}


		if (!currentUser.role) {
			return AuthorizationDecision.DENY;
		}

		/**
		 * Allow access only to model owners, using route as source of truth
		 *
		 * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
		 */
		if (deniedRoles?.includes(OWNER) && currentUser[securityId] === authorizationCtx.invocationContext.args[0]) {
			return AuthorizationDecision.DENY;
		}
		if (allowedRoles?.includes(OWNER) && currentUser[securityId] === authorizationCtx.invocationContext.args[0]) {
			return AuthorizationDecision.ALLOW;
		}

		if (!allowedRoles || allowedRoles.length === 0) {
			if (!deniedRoles || deniedRoles.length === 0) {
				return AuthorizationDecision.DENY;
			}
			return deniedRoles?.includes(currentUser.role) ? AuthorizationDecision.DENY : AuthorizationDecision.ALLOW;
		}

		return allowedRoles?.includes(currentUser.role) ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
	}
}
