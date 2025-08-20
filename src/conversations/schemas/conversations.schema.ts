import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation extends Document {
    @Prop()
    type: string;  // single: 1-1, group: nhiều người

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
    participants: mongoose.Schema.Types.ObjectId[];

    @Prop()
    name?: string; // tên nhóm (nếu là group)

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
