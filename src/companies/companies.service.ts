import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/companies.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { buildFilter, buildSort } from 'src/common/utils/query.utils';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(query: any) {
    const filter = buildFilter(query);
    const sort = buildSort(query);

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    let defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.companyModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)


    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate('createdBy')
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


  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateMany(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.companyModel.softDelete(
      { _id: id }
    )
  }
}
