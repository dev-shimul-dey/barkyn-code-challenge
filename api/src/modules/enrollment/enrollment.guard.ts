import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class EnrollmentAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userUuid = request.headers['x-user-id'];
    if (!userUuid) throw new UnauthorizedException('User ID required');
    
    const user = await this.usersService.findOne(userUuid);
    if (!user) throw new UnauthorizedException('User not found');
    
    request.user = user;
    return true;
  }
}
