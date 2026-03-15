import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseAccessGuard } from './courses.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
    @Headers('x-user-id') userUuid?: string,
  ) {
    return this.coursesService.findAll(query, userUuid);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid') uuid: string,
    @Headers('x-user-id') userUuid?: string,
  ) {
    return this.coursesService.findOne(uuid, userUuid);
  }
}
