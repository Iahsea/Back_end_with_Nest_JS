import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
    ],
    providers: [Gateway]
})
export class GatewayModule { }
