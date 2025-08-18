import { Body, Controller, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  @Post()
  create(@Body() createConversationDto: CreateConversationDto, @User() user: IUser) {
    return this.conversationsService.create(createConversationDto, user);
  }
}
