import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { GlobalEntity } from 'src/common/entities/global.entity';

@Entity()
export class Enrollment extends GlobalEntity {
  @ManyToOne(() => User, (user) => user.enrollments)
  user!: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course!: Course;

  @Column({ default: false })
  completed!: boolean;
}
