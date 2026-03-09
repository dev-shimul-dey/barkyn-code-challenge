import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Generated } from "typeorm";
import { Enrollment } from "../enrollment/enrollment.entity";
import { GlobalEntity } from "src/common/entities/global.entity";

@Entity()
export class User extends GlobalEntity {
  @Column()
  @Generated("uuid")
  uuid: string

  @Column()
  name!: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments!: Enrollment[];
}
