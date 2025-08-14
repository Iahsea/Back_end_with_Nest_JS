import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './google-auth.guard';
import { FacebookAuthGuard } from './facebook-auth.guard';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private rolesService: RolesService,
    ) { }


    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @ApiBody({ type: UserLoginDto })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
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

    @Get('account')
    @ResponseMessage("Get user information")
    async getProfile(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any
        user.permissions = temp.permissions;
        return { user };
    }

    @Public()
    @Get('refresh')
    @ResponseMessage("Get User by refresh token")
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const refreshToken = request.cookies["refresh_token"];
        return this.authService.processNewToken(refreshToken, response)
    }

    @ResponseMessage("Logout User")
    @Post('/logout')
    async logout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.handleLogout(response, user);
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/login')
    googleLogin(@Req() req) {
        console.log('User in login:', req.user);
    }


    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleCallBack(
        @Req() req,
        @Res() response: Response
    ) {
        const tokens = await this.authService.login(req, response)
        // redirect về front-end kèm token
        return response.redirect(`http://localhost:3000?token=${tokens.access_token}`)
    }


    @Public()
    @Get("/facebook/login")
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<any> {

    }

    @Public()
    @Get("/facebook/callback")
    @UseGuards(FacebookAuthGuard)
    async facebookLoginRedirect(
        @Req() req,
        @Res() response: Response
    ): Promise<any> {
        const tokens = await this.authService.login(req, response)
        // redirect về front-end kèm token
        return response.redirect(`http://localhost:3000?token=${tokens.access_token}`)
    }
}
