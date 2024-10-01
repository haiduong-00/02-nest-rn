import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username };
    }
}

/* 
Target: mỗi lần send req lên thì ta cần đính kèm token, thì strategy lấy cái token từ phần header
của bạn và validate cái token đó. 
Sau khi validate sau lấy được phần payload
*/
