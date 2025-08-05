import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { buildQueryParams } from 'src/common/utils/query.utils';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const isExits = await this.roleModel.findOne({ name })

    if (isExits.name === 'ADMIN') {
      throw new BadRequestException("Không thể xóa role ADMIN")
    }

    if (isExits) {
      throw new BadRequestException(`Role với name "${name}" đã tồn tại`);
    }

    let newRole = await this.roleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt
    }
  }

  async findAll(query: any) {
    const { filter, sort, populates } = buildQueryParams(query);

    const page = parseInt(query.current);
    const limit = parseInt(query.pageSize);

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.roleModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate(populates)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found role with id = ${id}`)
    }

    return await this.roleModel.findById(id)
      .populate({
        path: "permissions",
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
      });

  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException(`not found role with id = ${_id}`)
    }

    console.log("check", updateRoleDto);

    const { name } = updateRoleDto

    let isExits = await this.roleModel.findOne({ name })

    let oldName = (await this.roleModel.findById(_id)).name

    if (isExits && name !== oldName) {
      throw new BadRequestException(`Role với name "${name}" đã tồn tại ở bản ghi khác`);
    }

    const upload = await this.roleModel.updateOne(
      { _id },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return upload;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`not found role with id = ${id}`)

    const foundRole = await this.roleModel.findById(id);
    if (foundRole.name === ADMIN_ROLE) {
      throw new BadRequestException("Không thể xóa role ADMIN")
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.roleModel.softDelete(
      { _id: id }
    )
  }
}
