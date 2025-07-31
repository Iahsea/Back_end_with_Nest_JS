import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
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

    @ArrayNotEmpty({ message: 'Skill không được để trống' })
    @IsString({ each: true, message: 'Mỗi skill phải là chuỗi' })
    skill: string[];

    @IsNotEmpty({ message: 'Location không được để trống', })
    location: string;

    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống', })
    level: string;

    @IsNotEmpty({ message: 'IsActive không được để trống', })
    isActive: boolean;

    @IsNotEmpty({ message: 'StartDate không được để trống', })
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate không được để trống', })
    endDate: Date;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

}
