import { CanActivate, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { UsersService } from "src/users/users.service";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async canActivate(context: any): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient(); // <-- lấy socket client
      const authHeader = client.handshake.headers.authorization;

      if (!authHeader) {
        throw new WsException('Unauthorized: No token provided');
      }

      const bearerToken = authHeader.split(' ')[1];
      if (!bearerToken) {
        throw new WsException('Unauthorized: Invalid token format');
      }

      const decoded = this.jwtService.verify(bearerToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      }) as any;

      console.log('check decode', decoded);

      const user = await this.usersService.findOneByUsername(decoded.email);
      if (!user) {
        throw new WsException('Unauthorized: User not found');
      }

      // gán user chuẩn NestJS/socket.io
      client.data.user = user;

      return true;
    } catch (ex) {
      console.error('WsGuard error:', ex);
      throw new WsException('Unauthorized: Invalid or missing token');
    }
  }
}
