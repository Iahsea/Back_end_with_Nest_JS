import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @ApiProperty()
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}
