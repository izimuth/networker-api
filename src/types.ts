
import { User, UserAuthToken } from "./users";

declare global {
	namespace Express {
		export interface Request {
			authToken?: UserAuthToken;
			user?: User;
		}
	}
}

export {};