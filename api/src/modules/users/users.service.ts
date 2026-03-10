import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findOne(uuid: string) {
    return this.userRepository.findOneBy({ uuid });
  }

  async getProfile(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ["enrollments", "enrollments.course"],
    });
    if (!user) throw new NotFoundException("User not found");
    const enrollments = user.enrollments ?? [];
    return {
      id: user.id,
      name: user.name,
      enrolledCourses: enrollments.map((e) => e.course.uuid),
      completedCourses: enrollments.filter((e) => e.completed).map((e) => e.course.uuid),
    };
  }
}
