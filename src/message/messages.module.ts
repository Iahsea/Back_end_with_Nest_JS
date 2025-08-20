import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatModule } from 'src/chat/chat.module';
import { Conversation, ConversationSchema } from 'src/conversations/schemas/conversations.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Conversation.name, schema: ConversationSchema }
        ]),
        forwardRef(() => ChatModule)
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService], // nếu muốn dùng ở module khác
})
export class MessagesModule { }
