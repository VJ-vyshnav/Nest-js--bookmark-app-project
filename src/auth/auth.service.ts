import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // 1. Generate the password hash
    const hash = await argon.hash(dto.password);

    // 2. Save new user in the db
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
  }

  signin() {
    return { msg: 'i have signed in' };
  }
}
