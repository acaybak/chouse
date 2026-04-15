import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { RoleName } from '../common/enums/role-name.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RoleName, unique: true })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
