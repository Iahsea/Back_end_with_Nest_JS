import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }


    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage("User Login")
    async login(
        @Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        console.log(">>>>> check req", registerUserDto);
        return this.authService.register(registerUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
