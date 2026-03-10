import { Controller, Post, Patch, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/enrollment.dto';
import { EnrollmentAuthGuard } from './enrollment.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard, EnrollmentAuthGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enroll(@Request() req, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.enroll(req.user, dto.courseUuid);
  }

  @Patch(':courseUuid/complete')
  complete(@Request() req, @Param('courseUuid') courseUuid: string) {
    return this.enrollmentService.complete(req.user, courseUuid);
  }

  @Get()
  findMyEnrollments(@Request() req) {
    return this.enrollmentService.findMyEnrollments(req.user);
  }
}
