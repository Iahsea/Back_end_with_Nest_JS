import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        }
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
        // console.log(">>>>> check user register", registerUserDto);
        // const { name, email, password, age, gender, address } = registerUserDto;
        // const existUser = await this.usersService.findOneByUsername(email);
        // if (existUser) {
        //     return 'User already exist';
        // }
        // const hashPassword = this.usersService.getHashPassword(password)
        // const data = await this.userModel.create({
        //     ...registerUserDto,
        //     password: hashPassword,
        //     role: 'USER'
        // });
        // return {
        //     _id: data._id,
        //     createdAt: data.createdAt
        // }
    }
}
