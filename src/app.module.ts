import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [Authmodule, BookmarkModule, UserModule, PrismaModule],
})
export class AppModule {}
