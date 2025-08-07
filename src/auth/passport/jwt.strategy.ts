
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private rolesService: RolesService,
        private companyService: CompaniesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: IUser) {
        const { _id, name, email, role, company } = payload;
        // cần gán thêm permissions vào req.user

        const userRole = role as unknown as { _id: string; name: string }
        const tempRole = (await this.rolesService.findOne(userRole._id)).toObject()

        const userCompany = company as unknown as { _id: string; name: string };
        const tempCompany = await this.companyService.findOne(userCompany._id);

        //req.user
        return {
            _id,
            name,
            email,
            role,
            permissions: tempRole?.permissions ?? [],
            company: {
                _id: tempCompany._id.toString(),
                name: tempCompany.name,
            },
        };
    }
}
