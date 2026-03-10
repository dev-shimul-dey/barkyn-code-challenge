import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Simulating auth by checking a header for the user UUID
    const userUuid = request.headers['x-user-id'];
    
    if (!userUuid) {
      throw new UnauthorizedException('User ID header (x-user-id) missing');
    }

    const user = await this.usersService.findOne(userUuid);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    request.user = user;
    return true;
  }
}
