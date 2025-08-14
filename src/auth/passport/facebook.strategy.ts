import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { AuthService } from "../auth.service";



@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService
    ) {
        super({
            clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
            clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
            callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
            profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
            scope: ['public_profile']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const facebookUserDto = {
            facebookId: profile.id,
            email: profile.emails?.[0]?.value || null, // email có thể null
            name: [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ') || 'Facebook User',
            avatarUrl: profile.photos[0]?.value || null,
            provider: 'facebook',
            password: ''
        }

        try {
            const user = await this.authService.validateFacebookUser(facebookUserDto);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }

}
