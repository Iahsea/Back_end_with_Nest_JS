import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @ApiProperty()
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Skill không được để trống' })
    @IsArray({ message: 'Skill có định dạng là array' })
    @IsString({ each: true, message: 'Mỗi skill phải là chuỗi' })
    skills: string[];

    @ApiProperty()
    @IsNotEmpty({ message: 'Location không được để trống', })
    location: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Salary không được để trống', })
    salary: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Level không được để trống', })
    level: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'IsActive không được để trống', })
    isActive: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'StartDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'StartDate có định dạng là date' })
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'EndDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'EndDate có định dạng là date' })
    endDate: Date;

    @ApiProperty()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

}
