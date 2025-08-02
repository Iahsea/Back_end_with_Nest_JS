import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { buildFilter, buildSort } from 'src/common/utils/query.utils';

@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const { name, skills, company, salary, quantity, level,
      description, startDate, endDate, isActive, location } = createJobDto;

    let newJob = await this.jobModel.create({
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
      location,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    }
  }

  async findAll(query: any) {
    const filter = buildFilter(query);
    const sort = buildSort(query);

    const page = parseInt(query.current);
    const limit = parseInt(query.pageSize);

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.jobModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.jobModel
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found job`

    return await this.jobModel.findById(id)
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    console.log("check _id", _id);

    const upload = await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    console.log("upload", upload);
    return upload;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`

    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.jobModel.softDelete(
      { _id: id }
    )
  }
}
