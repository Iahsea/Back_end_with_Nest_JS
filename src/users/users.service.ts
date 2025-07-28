import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }


  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }
    const getHashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: getHashPassword,
      age,
      gender,
      address,
      role: role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    // Check email
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }
    const hashPassword = this.getHashPassword(password)
    const newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: "USER"
    });
    return newRegister;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`

    return this.userModel.findOne({
      _id: id
    });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`

    return this.userModel.softDelete({
      _id: id
    })

  }
}
