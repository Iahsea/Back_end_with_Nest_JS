import { UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { WsGuard } from "src/auth/ws/ws.guard";


@WebSocketGateway(3002, { cors: true })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log('New user connected...', client.id);

        this.server.emit('user-joined', {
            message: `New User Joined the chat: ${client.id}`,
        })
    }

    handleDisconnect(client: Socket) {
        console.log('User disconnected...', client.id);

        this.server.emit('user-left', {
            message: `User Left the chat: ${client.id}`,
        })
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('newMessage')
    handleEvent(client: Socket, message: any) {
        this.server.emit('message', message)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('newNMsg')
    sendMessage() {
        this.server.emit('newMsg', 'Hello world from the server')
    }
}