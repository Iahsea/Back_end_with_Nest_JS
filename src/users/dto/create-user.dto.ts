import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  @ApiProperty()
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name không được để trống', })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email không đúng định dạng', })
  @IsNotEmpty({ message: 'Email không được để trống', })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password không được để trống', })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Age không được để trống', })
  age: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Gender không được để trống', })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Address không được để trống', })
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Role không được để trống', })
  @IsMongoId({ message: 'Role có định dạng là mongo id' })
  role: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company!: Company;
}

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name không được để trống', })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email không đúng định dạng', })
  @IsNotEmpty({ message: 'Email không được để trống', })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password không được để trống', })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Age không được để trống', })
  age: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Gender không được để trống', })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Address không được để trống', })
  address: string;
}


export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin', description: 'username' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password'
  })
  readonly password: string;
}