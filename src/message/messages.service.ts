import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation, ConversationDocument } from 'src/conversations/schemas/conversations.schema';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: SoftDeleteModel<MessageDocument>,
        @InjectModel(Conversation.name) private conversationModel: SoftDeleteModel<ConversationDocument>
    ) { }

    async create(createMessage: CreateMessageDto, user: IUser) {
        const { conversationId, message } = createMessage;

        const conversation = await this.conversationModel.findById(conversationId);

        if (!conversation) {
            throw new BadRequestException('Conversation not found');
        }

        if (!conversation.participants.some(p => p.toString() === user._id.toString())) {
            console.log("conversation.participants: ", conversation.participants);
            console.log("user._id", user._id);

            throw new BadRequestException('User not in conversation');
        }

        const newMessage = await this.messageModel.create({
            conversationId,
            authorId: user._id,
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
