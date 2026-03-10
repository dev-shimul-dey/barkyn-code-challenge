import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  Generated,
} from 'typeorm';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Category } from '../categories/category.entity';
import { GlobalEntity } from 'src/common/entities/global.entity';

@Entity()
export class Course extends GlobalEntity {
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column()
  totalSeats!: number;

  @Column({ default: 0 })
  occupiedSeats!: number;

  @Index()
  @ManyToOne(() => Category, (category) => category.courses)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments!: Enrollment[];

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'prerequisiteCourseId' })
  prerequisite?: Course;

  @Column({ nullable: true })
  prerequisiteCourseId?: number;

  isLocked!: boolean;
  isEnrolled!: boolean;

  toJSON() {
    const obj: any = {
      uuid: this.uuid,
      title: this.title,
      price: Number(this.price),
      totalSeats: this.totalSeats,
      occupiedSeats: this.occupiedSeats,
      remainingSeats: this.totalSeats - this.occupiedSeats,
      category: this.category,
      prerequisite: this.prerequisite,
      isLocked: this.isLocked || false,
      isEnrolled: this.isEnrolled || false,
    };

    // course is unlocked if all previously enrolled courses are completed
    if (this.isEnrolled && !this.isLocked) {
      obj.description = this.description;
    }

    return obj;
  }
}
