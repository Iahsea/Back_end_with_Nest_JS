// src/casl/casl-ability.factory.ts
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from '@casl/ability';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Company } from 'src/companies/schemas/companies.schema';
import { Job } from 'src/jobs/schemas/job.schema';
import { Resume } from 'src/resumes/schemas/resume.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { IUser } from 'src/users/users.interface';
import { HR_ROLE } from 'src/databases/sample';


// Định nghĩa các actions và subjects
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'list';
export type Subjects = InferSubjects<
    typeof User | typeof Company | typeof Job | typeof Resume | typeof Role | typeof Permission
> | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<Permission>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
    ) { }

    async createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility as unknown as AbilityClass<AppAbility>
        );


        // Lấy role và permissions của user
        const userRole = await this.roleModel.findById(user.role).populate('permissions');

        if (userRole && userRole.permissions) {
            // Xử lý từng permission
            for (const permission of userRole.permissions) {
                const action = this.mapMethodToAction(permission.method);
                const subject = this.mapModuleToSubject(permission.module);

                if (action && subject) {
                    // Áp dụng permission với điều kiện cụ thể
                    can(action, subject, this.buildConditions(permission, user));
                }
            }
        }

        // Quyền mặc định - user luôn có thể đọc thông tin của chính mình
        // can('read', 'User', { _id: user._id });
        // can('update', 'User', { _id: user._id });

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }

    // Map HTTP method sang CASL action
    private mapMethodToAction(method: string): Actions | null {
        const methodMap = {
            'GET': 'read',
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete',
        };
        return methodMap[method.toUpperCase()] || null;
    }

    private mapModuleToSubject(module: string) {
        const moduleMap: Record<string, any> = {
            "users": User,
            "companies": Company,
            "jobs": Job,
            "resumes": Resume,
            "roles": Role,
            "permissions": Permission,
        };
        return moduleMap[module.toLowerCase()] || null;
    }

    // Xây dựng điều kiện cho permission
    private buildConditions(permission: any, user: any): any {
        const conditions: any = {};

        // Nếu user có company, chỉ cho phép truy cập data của company đó
        if (user.role.name === HR_ROLE && user.company && user.company._id) {
            conditions.companyId = user.company._id;
        }

        // Có thể thêm các điều kiện khác dựa trên permission cụ thể

        return conditions;
    }
}