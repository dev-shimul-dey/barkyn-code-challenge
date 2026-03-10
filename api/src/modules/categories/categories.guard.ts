import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CategoryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
