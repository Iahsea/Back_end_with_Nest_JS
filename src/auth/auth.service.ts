import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDto, RegisterUserDto, UserLoginFacebookDto, UserLoginGoogleDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';
import ms, { StringValue } from 'ms';
import { RolesService } from 'src/roles/roles.service';
import { permission } from 'process';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private rolesService: RolesService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id);

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }

                return objUser;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh_token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue),
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions,
            }
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(
            payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue),
            }
        );
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(
                refreshToken,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
                }
            )
            let user = await this.usersService.findUserByRefreshToken(refreshToken)

            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                const refresh_token = this.createRefreshToken(payload)

                //update user with refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id);

                //set refresh_token as cookies
                response.clearCookie("refresh_token")

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue),
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException(`Không tồn tại user. Vui lòng login.`)
            }


        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
        }
    }

    handleLogout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return 'ok';
    }

    async validateGoogleUser(googleUser: UserLoginGoogleDto) {

        const newUserRole = await this.roleModel.findOne({ name: USER_ROLE });
        // check theo google id
        let user = await this.userModel.findOne({ googleId: googleUser.googleId })

        if (!user) {
            user = await this.userModel.create({
                googleId: googleUser.googleId,
                email: googleUser.email,
                name: googleUser.name,
                avatarUrl: googleUser.avatarUrl,
                provider: 'google',
                password: null,
                role: newUserRole?.id
            })
        }

        // 3. Lấy quyền
        const userRole = user.role as unknown as { _id: string; name: string }
        const temp = await this.rolesService.findOne(userRole._id);

        return {
            ...user.toObject(),
            permissions: temp?.permissions ?? []
        };
    }

    async validateFacebookUser(facebookUser: UserLoginFacebookDto) {

        const newUserRole = await this.roleModel.findOne({ name: USER_ROLE });
        // check theo google id
        let user = await this.userModel.findOne({ facebookId: facebookUser.facebookId })

        if (!user) {
            user = await this.userModel.create({
                facebookId: facebookUser.facebookId,
                email: facebookUser?.email,
                name: facebookUser.name,
                avatarUrl: facebookUser.avatarUrl,
                provider: 'facebook',
                password: null,
                role: newUserRole?.id
            })
        }

        // 3. Lấy quyền
        const userRole = user.role as unknown as { _id: string; name: string }
        const temp = await this.rolesService.findOne(userRole._id);

        return {
            ...user.toObject(),
            permissions: temp?.permissions ?? []
        };
    }
}
