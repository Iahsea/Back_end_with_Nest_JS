import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    let isExits = await this.roleModel.findOne({ name })

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

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException(`not found permission with id = ${_id}`)
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

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
