import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'Skill không được để trống' })
    @IsArray({ message: 'Skill có định dạng là array' })
    @IsString({ each: true, message: 'Mỗi skill phải là chuỗi' })
    skills: string[];

    @IsOptional()
    location: string;

    salary: number;

    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống', })
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'IsActive không được để trống', })
    isActive: boolean;

    @IsNotEmpty({ message: 'StartDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'StartDate có định dạng là date' })
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'EndDate có định dạng là date' })
    endDate: Date;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

}
