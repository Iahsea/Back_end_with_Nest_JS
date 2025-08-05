import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: 'email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'skills không được để trống' })
    @IsArray({ message: 'skills có định dạng là array' })
    @IsString({ each: true, message: "mỗi skill định dạng là string" })
    skills: string[];
}
