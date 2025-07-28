import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { buildFilter, buildSort } from 'src/common/utils/query.utils';


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

  async findAll(query: any) {
    console.log(">>>>> check query", query);

    const filter = buildFilter(query);
    const sort = buildSort(query);

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)


    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .select('-password')
      // .populate('createdBy')
      .exec();

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        totalPages: totalPages,
        totalItems: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`

    return await this.userModel.findOne({
      _id: id
    }).select("-password")
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    console.log(">>>>> check update user", updateUserDto);

    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.userModel.softDelete(
      { _id: id }
    )
  }
}
