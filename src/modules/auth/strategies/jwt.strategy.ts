import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../../shared/decorators/roles.decorator';

interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    iat?: number;
    exp?: number;
}

interface JwtUser {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        });
    }

    validate(payload: JwtPayload): JwtUser {
        return {
            _id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            isActive: payload.isActive,
        };
    }
}
