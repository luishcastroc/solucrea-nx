import { User } from 'app/core/_models/user.model';

export interface AuthStateModel {
    accessToken: string | null;
    user: User | null;
}
