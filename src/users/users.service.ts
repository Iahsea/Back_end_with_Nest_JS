import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { buildQueryParams } from 'src/common/utils/query.utils';
import { ConfigService } from '@nestjs/config';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { ADMIN_ROLE, USER_ROLE } from 'src/databases/sample';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
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

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password)
    const newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?.id
    });
    return newRegister;
  }

  async findAll(query: any) {
    const { filter, sort, populates } = buildQueryParams(query);

    const page = parseInt(query.current);
    const limit = parseInt(query.pageSize);

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
      throw new BadRequestException(`not found user with id = ${id}`)

    return await this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } })
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

    const foundUser = await this.userModel.findById(id)
      .populate({ path: "role", select: { name: 1, _id: 1 } });

    const role = foundUser.role as unknown as { name: string };

    if (role.name === ADMIN_ROLE) {
      throw new BadRequestException("Không thể xóa tài khoản có role ADMIN")
    }

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

  updateUserToken = async (refreshToken: string, _id: string) => {
    await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
      .populate({ path: "role", select: { name: 1 } })
  }
}
