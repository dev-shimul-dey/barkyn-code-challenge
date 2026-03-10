import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const courseUuid = request.params.uuid;
    const userUuid = request.headers['x-user-id'];

    // Fetch the course with user context.
    
    const course = await this.coursesService.findOne(courseUuid, userUuid);
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    // If userUuid is provided, we need to ensure the user exists for proper authentication.
    if (userUuid) {
      const user = await this.usersService.findOne(userUuid);
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      request.user = user;
    }

    if (course.isLocked) {
      throw new ForbiddenException(
        'Access to this course is blocked until its prerequisite is completed.',
      );
    }

    return true;
  }
}
