import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @ResponseMessage("Create a new job")
  @Post()
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return await this.jobsService.create(createJobDto, user);
  }

  @Public()
  @ResponseMessage("Fetch jobs with pagination")
  @Get()
  findAll(@Query() queryString: any) {
    return this.jobsService.findAll(queryString);
  }

  @Public()
  @ResponseMessage("Fetch a job by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Update a job")
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return await this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Delete a job")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    console.log("check user", user);

    return this.jobsService.remove(id, user);
  }
}
