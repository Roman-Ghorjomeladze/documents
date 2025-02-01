import { ObjectSchema, object, required } from 'joi';

export const DbConfigSchema = (): ObjectSchema =>
  object({
    database: {
      host: required(),
      port: required(),
      pwd: required(),
      user: required(),
      name: required(),
    },
  });
