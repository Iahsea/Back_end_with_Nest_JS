import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(@InjectModel(Message.name) private messageModel: SoftDeleteModel<MessageDocument>) { }

    async create(createMessage: CreateMessageDto) {
        const { conversationId, authorId, message } = createMessage;

        const newMessage = await this.messageModel.create({
            conversationId,
            authorId,
            message
        });
        return newMessage;
    }

    async getMessages(userId: string, friendId: string) {
        return this.messageModel.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });
    }
}
