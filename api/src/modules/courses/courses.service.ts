import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { CacheService } from 'src/common/services/cache.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private cacheService: CacheService,
  ) {}

  async findAll(
    query: PaginationQueryDto,
    userUuid?: string,
    categoryId?: number,
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Generate cache key based on query parameters
    const cacheKey = `courses:findall:${page}:${limit}:${categoryId || 'all'}:${userUuid || 'nouser'}`;

    // Try to get from cache
    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Build where clause with optional category filter
    const where: any = {};
    if (categoryId) {
      where.category = { id: categoryId };
    }

    const [courses, total] = await this.courseRepository.findAndCount({
      where,
      relations: ['category', 'prerequisite'],
      skip,
      take: limit,
      order: { title: 'ASC' },
    });

    // Fetch user enrollment data and progression info once for all courses
    const enrollmentData = await this.getUserEnrollmentData(userUuid);

    const result = {
      data: courses.map((course) => {
        this.enrichCourseWithUserContext(course, enrollmentData);
        return course;
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Store in cache with 10-minute TTL (in milliseconds)
    await this.cacheService.set(cacheKey, result, 600000);

    return result;
  }

  async findOne(uuid: string, userUuid?: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { uuid },
      relations: ['category', 'prerequisite'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Fetch user enrollment data
    const enrollmentData = await this.getUserEnrollmentData(userUuid);

    // Enrich course with user context
    this.enrichCourseWithUserContext(course, enrollmentData);

    return course;
  }

  /**
   * Fetch user's enrollment data including order and completion status
   * Custom Progression Logic: User can only access a course if all previously enrolled courses are completed
   * @param userUuid - Optional user UUID
   * @returns Object containing enrollments sorted by date, completed courses, and enrolled courses
   */
  private async getUserEnrollmentData(userUuid?: string): Promise<{
    enrollments: Array<{
      courseId: number;
      completed: boolean;
      enrolledAt: Date;
    }>;
    completedCourseIds: Set<number>;
    enrolledCourseIds: Set<number>;
  }> {
    const defaultData = {
      enrollments: [],
      completedCourseIds: new Set<number>(),
      enrolledCourseIds: new Set<number>(),
    };

    if (!userUuid) {
      return defaultData;
    }

    const enrollments = await this.enrollmentRepository.find({
      where: { user: { uuid: userUuid } },
      select: { course: { id: true }, completed: true, createdAt: true },
      relations: ['course'],
      order: { createdAt: 'ASC' },
    });

    return {
      enrollments: enrollments.map((e) => ({
        courseId: e.course.id,
        completed: e.completed,
        enrolledAt: e.createdAt,
      })),
      completedCourseIds: new Set(
        enrollments.filter((e) => e.completed).map((e) => e.course.id),
      ),
      enrolledCourseIds: new Set(enrollments.map((e) => e.course.id)),
    };
  }

  /**
   * Custom Progression Logic: User can only access an enrolled course if all previously enrolled courses are completed
   * @param course - Course entity to enrich
   * @param enrollmentData - User enrollment data containing enrollments sorted by date, completed and enrolled course IDs
   */
  private enrichCourseWithUserContext(
    course: Course,
    enrollmentData: {
      enrollments: Array<{
        courseId: number;
        completed: boolean;
        enrolledAt: Date;
      }>;
      completedCourseIds: Set<number>;
      enrolledCourseIds: Set<number>;
    },
  ): void {
    const { enrollments, completedCourseIds, enrolledCourseIds } =
      enrollmentData;

    course.isEnrolled = enrolledCourseIds.has(course.id);

    // Custom progression: determine if course is locked
    let isLocked = false;
    if (course.isEnrolled && enrollments.length > 0) {
      // Find the current course in the enrollments list
      const courseIndex = enrollments.findIndex(
        (e) => e.courseId === course.id,
      );
      if (courseIndex > 0) {
        // Check if any previously enrolled course is not completed
        const uncompletedPreviousCourse = enrollments
          .slice(0, courseIndex)
          .some((e) => !e.completed);
        isLocked = uncompletedPreviousCourse;
      }
    }

    course.isLocked = isLocked;
  }
}
