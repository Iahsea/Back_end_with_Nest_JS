import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatGateway } from 'src/chat/chat.gateway';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        @Inject(forwardRef(() => ChatGateway))
        private readonly chatGateway: ChatGateway,
    ) { }

    @Post()
    async create(@Body() createMessageDto: CreateMessageDto) {
        const savedMessage = await this.messagesService.create(createMessageDto);

        // Emit message mới qua socket
        this.chatGateway.server.emit('message', savedMessage);
        return savedMessage;
    }
}
