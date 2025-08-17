import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ required: true })
    conversationId: string;   // ID của cuộc trò chuyện (1-1 hoặc group)

    @Prop({ required: true })
    authorId: string;         // Ai gửi tin nhắn

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
