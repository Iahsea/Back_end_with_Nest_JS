import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CACHE_MANAGER, CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }



  @Get()
  @CacheKey('custom_key')
  async findAll() {
    console.log("INSIDE CONTROLLER");
    return this.studentsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
