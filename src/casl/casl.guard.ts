// src/casl/casl.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { IS_CASL, RequiredRule } from 'src/decorator/customize';


@Injectable()
export class CaslGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules = this.reflector.get<RequiredRule[]>(
            IS_CASL,
            context.getHandler(),
        );

        if (!rules) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const ability = await this.caslAbilityFactory.createForUser(user);

        const hasAbility = rules.every((rule) =>
            this.isAllowed(ability, rule),
        );

        if (!hasAbility) {
            throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
        }

        return true;
    }

    private isAllowed(ability: AppAbility, rule: RequiredRule): boolean {
        return ability.can(rule.action, rule.subject);
    }
}