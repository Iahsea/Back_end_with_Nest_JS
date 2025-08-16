import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Server } from 'socket.io';


@WebSocketGateway(3002, {})
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

    @SubscribeMessage('newMessage')
    handleEvent(client: Socket, message: any) {
        this.server.emit('message', message)
    }
}