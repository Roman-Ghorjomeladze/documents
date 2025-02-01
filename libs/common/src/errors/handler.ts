import { ApiError } from '../utils/error';
import { SomethingWrongError } from './somethingWrongError';
import { Response } from 'express';

export const handleError = (res: Response, err: unknown) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err?.status).json(err.toJSON());
  }
  return res
    .status(SomethingWrongError.status)
    .json(SomethingWrongError.toJSON());
};
