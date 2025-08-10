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
import { UsersService } from 'src/users/users.service';


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
        private userService: UsersService,
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
                const action = this.mapMethodToAction(permission.method, permission.apiPath);

                const subject = this.mapModuleToSubject(permission.module);

                if (action && subject) {
                    // Áp dụng permission với điều kiện cụ thể
                    const conditions = await this.buildConditions(permission, user);
                    can(action, subject, conditions);
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
    private mapMethodToAction(method: string, apiPath: string): Actions | null {
        if (method.toUpperCase() === 'GET') {
            // Nếu kết thúc bằng /:id thì là 'read'
            if (/\/:id$/i.test(apiPath)) {
                return 'read';
            }
            // Ngược lại là 'list'
            return 'list';
        }

        const methodMap: Record<string, Actions> = {
            POST: 'create',
            PUT: 'update',
            PATCH: 'update',
            DELETE: 'delete',
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
    private async buildConditions(permission: any, user: any): Promise<any> {
        const conditions: any = {};

        // Nếu user có role là HR, chỉ cho phép truy cập data resume của company đó 
        if (user.role.name === HR_ROLE) {
            const companyId = await this.userService.findOne(user._id);
            if (companyId) {
                conditions.companyId = companyId.company._id;
            }
        }

        // Có thể thêm các điều kiện khác dựa trên permission cụ thể

        return conditions;
    }
}