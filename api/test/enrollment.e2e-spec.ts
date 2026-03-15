/**
 * E2E TEST: Race Condition Prevention - Real Database Test
 *
 * Run inside Docker: docker exec -it api npm run test:e2e enrollment
 *
 * This test verifies that EnrollmentService.enroll() prevents overbooking
 * when 2 concurrent users try to enroll in a course with 1 seat.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/modules/app.module';
import { EnrollmentService } from '../src/modules/enrollment/enrollment.service';
import { DataSource } from 'typeorm';
import { User } from '../src/modules/users/user.entity';
import { Course } from '../src/modules/courses/course.entity';

describe('EnrollmentService - Race Condition Prevention (E2E)', () => {
  let app: INestApplication;
  let enrollmentService: EnrollmentService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    enrollmentService = moduleFixture.get<EnrollmentService>(EnrollmentService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data
    const courseRepo = dataSource.getRepository(Course);
    const userRepo = dataSource.getRepository(User);

    await dataSource.query(
      `DELETE FROM enrollment WHERE "courseId" IN (SELECT id FROM course WHERE title LIKE $1)`,
      ['TEST_RACE_%'],
    );
    await dataSource.query(`DELETE FROM course WHERE title LIKE $1`, [
      'TEST_RACE_%',
    ]);
    await dataSource.query(`DELETE FROM "user" WHERE name LIKE $1`, [
      'Race Test User%',
    ]);
  });

  describe('Pessimistic Lock Prevents Race Condition', () => {
    it('Should prevent overbooking: 1 succeeds, 1 fails when 2 concurrent enrollments', async () => {
      console.log(
        '\n🔄 TEST: 2 concurrent users enrolling in 1-seat course...\n',
      );

      // Create test users
      const userRepo = dataSource.getRepository(User);
      const user1 = await userRepo.save(
        userRepo.create({ name: 'Race Test User 1' }),
      );
      const user2 = await userRepo.save(
        userRepo.create({ name: 'Race Test User 2' }),
      );

      // Create 1-seat course
      const courseRepo = dataSource.getRepository(Course);
      const course = await courseRepo.save(
        courseRepo.create({
          title: 'TEST_RACE_1_SEAT',
          description: 'Test race condition prevention',
          price: 29.99,
          totalSeats: 1,
          occupiedSeats: 0,
        }),
      );

      console.log(`📋 Setup:`);
      console.log(`   - Course: "${course.title}" (${course.totalSeats} seat)`);
      console.log(`   - User 1: ${user1.name}`);
      console.log(`   - User 2: ${user2.name}`);

      // Simulate concurrent enrollments
      const results = await Promise.allSettled([
        enrollmentService.enroll(user1, course.uuid),
        enrollmentService.enroll(user2, course.uuid),
      ]);

      const successes = results.filter((r) => r.status === 'fulfilled').length;
      const failures = results.filter((r) => r.status === 'rejected').length;

      console.log(`\n📊 Results:`);
      console.log(
        `   - User 1: ${results[0].status === 'fulfilled' ? '✅ ENROLLED' : '❌ REJECTED'}`,
      );
      if (results[0].status === 'rejected') {
        console.log(`     Error: ${(results[0] as any).reason.message}`);
      }
      console.log(
        `   - User 2: ${results[1].status === 'fulfilled' ? '✅ ENROLLED' : '❌ REJECTED'}`,
      );
      if (results[1].status === 'rejected') {
        console.log(`     Error: ${(results[1] as any).reason.message}`);
      }

      // Verify database state
      const updatedCourse = await courseRepo.findOne({
        where: { uuid: course.uuid },
      });

      console.log(`\n🗄️ Database State:`);
      console.log(
        `   - Course occupiedSeats: ${updatedCourse?.occupiedSeats}/${updatedCourse?.totalSeats}`,
      );
      console.log(
        `   - No overbooking: ${updatedCourse?.occupiedSeats === 1 ? '✅ YES' : '❌ NO'}`,
      );

      // ASSERTIONS
      expect(successes).toBe(1);
      expect(failures).toBe(1);
      expect(updatedCourse?.occupiedSeats).toBe(1);
      expect(updatedCourse?.occupiedSeats).toBeLessThanOrEqual(
        updatedCourse?.totalSeats!,
      );

      console.log(
        `\n✅ TEST PASSED: Race condition prevented with pessimistic lock\n`,
      );
    });    
  });
});
