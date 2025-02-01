import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { RegisterDto } from '../../auth/src/dto/register.dto';
import { UserStatuses } from '@app/common/constants/user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const user = new User();
    user.email = registerDto.email;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.password = await bcrypt.hash(registerDto.password, 10);
    user.status = UserStatuses.ACTIVE;
    const created = await this.userRepository.save(user);
    delete created.password;
    return created;
  }

  async findByEmail(email: string, selectPassword = false): Promise<User> {
    const extraParams = {};
    if (selectPassword) {
      extraParams['select'] = [
        'email',
        'password',
        'firstName',
        'lastName',
        'id',
        'status',
      ];
    }
    return await this.userRepository.findOne({
      where: { email },
      ...extraParams,
    });
  }
}
