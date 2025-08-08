import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có giá trị boolean' })
    isActive: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'permission không được để trống' })
    @IsMongoId({ each: true, message: 'each permission là mongo object id' })
    @IsArray({ message: 'permission có định dạng là array' })
    permissions: mongoose.Schema.Types.ObjectId[];
}
