import { RoleName } from '../common/enums/role-name.enum';

export type JwtPayload = {
  sub: string;
  role: RoleName;
  email: string;
};
