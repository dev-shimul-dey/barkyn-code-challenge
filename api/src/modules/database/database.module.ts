import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        database: configService.getOrThrow<string>('DB_NAME'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
        migrations: [__dirname + '/migrations/*.ts'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}