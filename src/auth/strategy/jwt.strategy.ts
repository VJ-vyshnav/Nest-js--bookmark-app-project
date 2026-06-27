import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 1. Define an interface for the payload to satisfy ESLint
interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // 1. Specify the strategy name as 'jwt' it will be used in the auth gaurd and default will be jwt and no need to specify it in the auth guard
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  // 2. Use JwtPayload instead of any.
  // 3. Since there's no DB lookup yet, return a Promise directly to satisfy 'require-await'
  validate(payload: JwtPayload): Promise<{ userId: number; email: string }> {
    return Promise.resolve({
      userId: payload.sub,
      email: payload.email,
    });
  }
}
