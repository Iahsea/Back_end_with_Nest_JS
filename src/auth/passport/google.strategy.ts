import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";



@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) {
        const googleUserDto = {
            googleId: profile.id,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            avatarUrl: profile.photos[0]?.value || null,
            provider: 'google',
            password: ''
        }

        try {
            const user = await this.authService.validateGoogleUser(googleUserDto);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }

}
