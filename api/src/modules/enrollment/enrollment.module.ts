import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './enrollment.entity';
import { UsersModule } from '../users/users.module';
import { EnrollmentAuthGuard } from './enrollment.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    UsersModule
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentAuthGuard],
})
export class EnrollmentModule {}
