import { ApiError } from '@app/common/utils/error';
import { HttpStatus } from '@nestjs/common';

export const UserNotFoundByCredentialsError: ApiError = new ApiError(
  'User with such credentials not found!',
  HttpStatus.BAD_REQUEST,
  'USER_NOT_FOUND',
);
