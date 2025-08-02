import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { buildFilter, buildSort } from 'src/common/utils/query.utils';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {

  constructor(
    @InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;

    let newCV = await this.resumeModel.create({
      email,
      userId: _id,
      url,
      status: 'PENDING',
      companyId,
      jobId,
      history: [{
        status: 'PENDING',
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }],
      createdBy: { _id, email }
    })
    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt
    };
  }

  async findAll(query: any) {
    const filter = buildFilter(query);
    const sort = buildSort(query);

    const page = parseInt(query.current);
    const limit = parseInt(query.pageSize);

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.resumeModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found resume with id = ${id}`)
    }

    return await this.resumeModel.findById(id)
  }

  async handleFindResumeByUser(user: IUser) {
    const result = await this.resumeModel.find({ userId: user._id });
    return result;
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found resume")
    }

    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      }
    )
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found resume`

    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.resumeModel.softDelete(
      { _id: id }
    )
  }
}
