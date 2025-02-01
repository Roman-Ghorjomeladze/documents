import { User } from '../../../../modules/users/entities/user.entity';
import { UserStatuses } from '../../../constants/user';

export const userMock: User = (() => {
  const user: User = new User();
  user.id = 1;
  user.firstName = 'John';
  user.lastName = 'Doe';
  user.email = 'john@doe.com';
  user.password = '123456';
  user.createdAt = new Date('2024-11-02T00:34:48.592Z');
  user.updatedAt = new Date('2024-11-02T00:34:48.592Z');
  user.deletedAt = null;
  user.status = UserStatuses.ACTIVE;
  return user;
})();
