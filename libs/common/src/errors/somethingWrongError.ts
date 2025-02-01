import { HttpStatus } from '@nestjs/common';

import { ApiError } from '../utils/error';

export const SomethingWrongError = new ApiError(
  'Something went wrong',
  HttpStatus.INTERNAL_SERVER_ERROR,
  'SOMETHING_WENT_WRONG',
);
