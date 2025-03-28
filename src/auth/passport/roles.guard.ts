import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/customize';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách role yêu cầu từ @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Nếu route không yêu cầu role cụ thể, cho phép truy cập
    }

    // Lấy request và user từ context
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User này được lấy từ `JwtStrategy`

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Kiểm tra nếu user có role phù hợp với route
    const hasRole = requiredRoles.includes(user.role as Role);
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
