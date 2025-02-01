import { ApiError } from '../utils/error';
import { HttpStatus } from '@nestjs/common';

export const EmailIsTakenError: ApiError = new ApiError(
  'Email is taken',
  HttpStatus.BAD_REQUEST,
  'EMAIL_TAKEN',
);
