import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { verify } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //<--------- 1. Generate the password hash--------->
    const hash = await argon.hash(dto.password);

    //< --------2. Save new user in the db------------>
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // here js says hey take the  hash out and rename it to an unsued var (_)
      // and dumb every thing else to a new obj userWithoutHash

      const { hash: _, ...userWithoutHash } = user;

      return userWithoutHash;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //--what we gonna doo yehh--->

    //1.find the user if no user throw a fuking exeption
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('credentials incorrect');

    //2.compare passwords if incorrect again another fucking exeption
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('credentials incorrect');
    //oke send back the user

    return { msg: 'i have signed in' };
  }
}
