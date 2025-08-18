import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from './schemas/conversations.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class ConversationsService {

    constructor(
        @InjectModel(Conversation.name) private conversationModel: SoftDeleteModel<ConversationDocument>,
    ) { }

    async create(createConversationDto: CreateConversationDto, user: IUser) {
        const { name, participants, type } = createConversationDto;
        const created = await this.conversationModel.create({
            name,
            participants,
            type,
            createdBy: {
                _id: user._id,
                email: user.email
            }
        })
        return created;
    }
}
