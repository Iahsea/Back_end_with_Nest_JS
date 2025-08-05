import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { buildQueryParams } from 'src/common/utils/query.utils';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {

  constructor(
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email, name, skills } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng dùng email khác!`)
    }

    let newSubscriber = await this.subscriberModel.create({
      email,
      name,
      skills,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newSubscriber?._id,
      createdAt: newSubscriber?.createdAt
    };
  }

  async findAll(query: any) {
    const { filter, sort, populates } = buildQueryParams(query);

    const page = parseInt(query.current);
    const limit = parseInt(query.pageSize);

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.subscriberModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.subscriberModel
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
      throw new BadRequestException(`not found subscriber with id = ${id}`)
    }

    return await this.subscriberModel.findById(id);

  }

  async update(_id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException(`not found subscriber with id = ${_id}`)
    }

    const upload = await this.subscriberModel.updateOne(
      { _id },
      {
        ...updateSubscriberDto,
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
      throw new BadRequestException(`not found subscriber with id = ${id}`)

    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.subscriberModel.softDelete(
      { _id: id }
    )
  }
}
