import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { MessagesModule } from 'src/message/messages.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => MessagesModule),
    JwtModule.register({}),
    UsersModule
  ],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule { }
