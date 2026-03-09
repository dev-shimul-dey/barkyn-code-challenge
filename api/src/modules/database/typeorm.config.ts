// TypeORM DataSource configuration used by the CLI.
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

// Load environment variables so ConfigService can read DB_* values
dotenv.config({
  path: join(__dirname, '..', '..', '..', '..', '.env'),
});

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: Number(configService.getOrThrow<string>('DB_PORT')),
  database: configService.getOrThrow<string>('DB_NAME'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});