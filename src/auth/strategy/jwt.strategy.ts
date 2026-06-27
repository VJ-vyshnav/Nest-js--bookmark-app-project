import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service'; // Ensure this path matches your folder structure

// 1. Defined interface
interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService, // if no prisma service then no this.prisma
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  async validate(payload: JwtPayload) {
    //now await works smooth like butttaaar!!!
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const { hash: _hash, ...userWithoutHash } = user; // this mf again all that shi just to write user.hash

    // Whatever is returned here is automatically attached to the Request object as req.user.thats fking awesome!!
    return userWithoutHash;
  }
}
