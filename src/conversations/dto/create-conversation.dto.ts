import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateConversationDto {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'participants không được để trống' })
    @IsMongoId({ each: true, message: 'each participants là mongo object id' })
    @IsArray({ message: 'participants có định dạng là array' })
    participants: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'type không được để trống' })
    type: string;
}
