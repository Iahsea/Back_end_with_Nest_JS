import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class StudentsService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async findAll() {
    const cached = await this.cacheManager.get('students_all');
    if (cached) {
      console.log("RD");
      return cached;
    }
    console.log("DB");
    const students = await this.retrieveStudentsFromDb();
    await this.cacheManager.set('students_all', students, 60 * 1000);
    return students;
  }

  async retrieveStudentsFromDb() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const students = [
          { name: "John", age: 20, GPA: 3.5 },
          { name: "Jane", age: 22, GPA: 3.8 },
          { name: "Bob", age: 21, GPA: 3.2 },
        ];
        resolve(students);
      }, 1000);
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
