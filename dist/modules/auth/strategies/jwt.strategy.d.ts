import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
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
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): JwtUser;
}
export {};
