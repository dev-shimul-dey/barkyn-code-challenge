import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev =
          configService.get('API_NODE_ENV') === 'development' ||
          configService.get('API_NODE_ENV') === 'dev';
        return {
          ttl: 60000,
          // Much higher limit in development, strict in production
          limit: isDev ? 1000 : 10,
        };
      },
    }),
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    CoursesModule,
    EnrollmentModule,
  ],
})
export class AppModule {}
