import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';

export class UpdateRoleDto extends PartialType(CreateConversationDto) { }
