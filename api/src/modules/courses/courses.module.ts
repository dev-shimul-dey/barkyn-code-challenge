import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseAccessGuard } from './courses.guard';
import { Course } from './course.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment]),
    UsersModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CourseAccessGuard],
})
export class CoursesModule {}
