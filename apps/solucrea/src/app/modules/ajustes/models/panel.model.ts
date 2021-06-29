import { Role } from '@prisma/client';
export interface IPanel {
    id: string;
    icon: string;
    title: string;
    description: string;
    roles: Role[];
}
