import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private dataSource: DataSource,
  ) {}

  async enroll(user: User, courseUuid: string) {
    // Transaction to ensure data integrity and prevent race conditions
    const result = await this.dataSource.transaction(async (manager) => {
      // Pessimistic lock to prevent overbooking during concurrent requests
      const course = await manager.findOne(Course, {
        where: { uuid: courseUuid },
        lock: { mode: 'pessimistic_write' },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if already enrolled
      const existing = await manager.findOne(Enrollment, {
        where: {
          user: { id: user.id },
          course: { id: course.id },
        },
      });

      if (existing) {
        throw new ConflictException('Already enrolled');
      }

      // Check available seats
      if (course.occupiedSeats >= course.totalSeats) {
        throw new BadRequestException('Course is full');
      }

      // Increment occupied seats
      course.occupiedSeats += 1;
      await manager.save(course);

      // Create enrollment record
      const enrollment = manager.create(Enrollment, {
        user,
        course,
        completed: false,
      });

      return manager.save(enrollment);
    });

    // Load relations for serialization
    const enrollmentWithRelations = await this.enrollmentRepository.findOne({
      where: { id: result.id },
      relations: ['course', 'user'],
    });

    return this.serializeEnrollment(enrollmentWithRelations!);
  }

  async complete(user: User, courseUuid: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: user.id },
        course: { uuid: courseUuid },
      },
      relations: ['course', 'user'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.completed = true;
    const saved = await this.enrollmentRepository.save(enrollment);
    return this.serializeEnrollment(saved);
  }

  async findMyEnrollments(user: User) {
    const enrollments = await this.enrollmentRepository.find({
      where: { user: { id: user.id } },
      relations: ['course', 'user'],
      order: { createdAt: 'DESC' },
    });
    return enrollments.map((e) => this.serializeEnrollment(e));
  }

  private serializeEnrollment(enrollment: Enrollment) {
    return {
      id: enrollment.id,
      userUuid: enrollment.user?.uuid,
      courseUuid: enrollment.course?.uuid,
      completed: enrollment.completed,
      course: enrollment.course,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
      enrolledAt: enrollment.createdAt,
      completedAt:
        enrollment.updatedAt && enrollment.completed
          ? enrollment.updatedAt
          : null,
    };
  }
}
