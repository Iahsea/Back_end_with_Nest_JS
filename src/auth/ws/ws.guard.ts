import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  async canActivate(context: any): Promise<boolean> {
    try {
      const authHeader = context.args[0].handshake.headers.authorization;
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

      // gán user vào client để sau dùng trong handler
      context.args[0].user = user;

      return true;
    } catch (ex) {
      console.error('WsGuard error:', ex);
      throw new WsException('Unauthorized: Invalid or missing token');
    }
  }
}
