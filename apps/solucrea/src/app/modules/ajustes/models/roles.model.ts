import { Role } from '@prisma/client';
export interface IRole {
    label: string;
    value: Role;
    description: string;
}
