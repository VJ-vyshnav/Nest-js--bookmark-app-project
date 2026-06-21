import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule], // Make sure this is here!
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
