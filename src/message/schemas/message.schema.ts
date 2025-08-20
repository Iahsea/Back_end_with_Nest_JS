import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ required: true })
    conversationId: string;   // ID của cuộc trò chuyện (1-1 hoặc group)

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    authorId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    message: string;          // Nội dung tin nhắn

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
