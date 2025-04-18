import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';

//decorator public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

//decorator roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);