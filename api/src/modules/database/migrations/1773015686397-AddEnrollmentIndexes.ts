import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddEnrollmentIndexes1773015686397 implements MigrationInterface {
  name = 'AddEnrollmentIndexes1773015686397';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Composite index for common queries filtering both user and course
    await queryRunner.createIndex(
      'enrollment',
      new TableIndex({
        name: 'IDX_enrollment_userId_courseId',
        columnNames: ['userId', 'courseId'],
        isUnique: true, // Prevent duplicate enrollments
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('enrollment', 'IDX_enrollment_userId_courseId');
  }
}
