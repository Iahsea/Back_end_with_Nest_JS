import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from 'src/casl/casl-ability.factory/casl-ability.factory';


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const IS_PUBLIC_PERMISSIONS = 'isPublicPermission'
export const SkipCheckPermission = () => SetMetadata(IS_PUBLIC_PERMISSIONS, true);


export interface RequiredRule {
    action: Actions;
    subject: Subjects;
}

export const IS_CASL = 'casl'
export const CheckPolicies = (...requirements: RequiredRule[]) =>
    SetMetadata(IS_CASL, requirements);