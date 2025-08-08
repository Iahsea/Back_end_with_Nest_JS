import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên công ty không được để trống', })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống', })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;
}
