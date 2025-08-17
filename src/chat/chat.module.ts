import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { MessagesModule } from 'src/message/messages.module';

@Module({
  imports: [forwardRef(() => MessagesModule)],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule { }
