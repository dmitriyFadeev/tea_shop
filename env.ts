import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION: z.string().default('1h'),
    REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
    MINIOACCESSKEY: z.string(),
    MINIOENDPOINT: z.string(),
    MINIOPORT: z.coerce.number(),
    MINIOSECRETKEY: z.string(),
    MINIOUSESSL: z.coerce.boolean(),
    ALGORITHM: z.string(),
    KEY: z.string(),
    IV: z.string(),
    PORT_MINIAPP: z.coerce.number(),
    PORT_BOT: z.coerce.number(),
    BOT_TOKEN: z.string(),
    BOT_MINI_APP_URL: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});