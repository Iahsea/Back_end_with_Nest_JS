import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        @Inject(forwardRef(() => ChatGateway))
        private readonly chatGateway: ChatGateway,
    ) { }

    @Post()
    @ResponseMessage("Create a new message")
    async create(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
        const savedMessage = await this.messagesService.create(createMessageDto, user);

        // Emit message mới qua socket
        this.chatGateway.server.emit('message', savedMessage);
        return savedMessage;
    }
}
