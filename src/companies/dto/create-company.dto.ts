import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên công ty không được để trống', })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống', })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Logo không được để trống', })
    logo: string;
}
