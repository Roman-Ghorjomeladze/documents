import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@app/common/utils/error';

export const EmailIsTakenError: ApiError = new ApiError(
  'Email is taken',
  HttpStatus.BAD_REQUEST,
  'EMAIL_TAKEN',
);
