import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Declare the property explicitly without initializing it in the parameter list
  private configService: ConfigService;

  constructor(config: ConfigService) {
    // 1. Grab the URL from the parameter directly (bypasses the 'this' restriction)
    const dbUrl =
      config.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL is missing from configuration.');
    }

    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);

    // 2. Call super first
    super({ adapter });

    // 3. Now it is perfectly safe to use 'this'
    this.configService = config;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
