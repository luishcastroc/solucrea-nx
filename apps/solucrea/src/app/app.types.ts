import { Usuario } from '@prisma/client';
import { FuseNavigationItem } from '@fuse/components/navigation';

export interface InitialData {
    navigation: FuseNavigationItem[];
    user: Usuario;
}
