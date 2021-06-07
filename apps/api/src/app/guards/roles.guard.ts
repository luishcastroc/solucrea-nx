import { UnauthorizedException } from '@nestjs/common';
/* eslint-disable arrow-parens */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true;
        }
        const { user, params } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => {
            let result = false;
            if (user.role === role) {
                switch (user.role) {
                    case Role.CAJERO:
                    case Role.SECRE:
                    case Role.USUARIO:
                        if (user.userId !== params.id) {
                            throw new UnauthorizedException();
                        } else {
                            result = true;
                        }
                        break;
                    default:
                        result = true;
                }
                return result;
            }
        });
    }
}
