import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/message/messages.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/ws/ws.guard';

@WebSocketGateway(3002, { cors: true })
export class ChatGateway {
  constructor(private readonly messageService: MessagesService) { }

  @WebSocketServer()
  server: Server;

  // Join room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string
  ) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // Leave room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string
  ) {
    client.leave(room);
    console.log(`Client ${client.id} left room ${room}`);
  }

  // Send message
  @UseGuards(WsGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto
  ) {

    const user = client.data.user;

    console.log(client.rooms);
    // 1. Lưu vào DB
    const savedMessage = await this.messageService.create(createMessageDto, user);

    // 2. Emit message cho tất cả user trong room conversationId
    this.server.to(createMessageDto.conversationId).emit('msg', savedMessage);
  }
}
