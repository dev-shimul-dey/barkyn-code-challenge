import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Course } from "../courses/course.entity";
import { GlobalEntity } from "src/common/entities/global.entity";

@Entity()
export class Category extends GlobalEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Course, (course) => course.category)
  courses!: Course[];

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}