import { FuseNavigationItem } from '@fuse/components/navigation';
import { User } from 'app/core/_models/user.model';

export interface InitialData {
    navigation: FuseNavigationItem[];
    user: User;
}
