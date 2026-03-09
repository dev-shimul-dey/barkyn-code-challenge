import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index, Generated } from "typeorm";
import { Enrollment } from "../enrollment/enrollment.entity";
import { Category } from "../categories/category.entity";
import { GlobalEntity } from "src/common/entities/global.entity";

@Entity()
export class Course extends GlobalEntity {
  @Column()
  @Generated("uuid")
  uuid: string

  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
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
  @JoinColumn({ name: "prerequisiteCourseId" })
  prerequisite?: Course;

  @Column({ nullable: true })
  prerequisiteCourseId?: number;
}