import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({
        description: "ID của cuộc trò chuyện",
        example: "64f2b4a8d5f3c2b9a1e9d123"
    })
    @IsNotEmpty({ message: 'conversationId không được để trống' })
    conversationId: string;

    @ApiProperty({
        description: "Nội dung tin nhắn",
        example: "Xin chào, bạn có thể hỗ trợ mình không?"
    })
    @IsNotEmpty({ message: 'message không được để trống' })
    message: string;
}
