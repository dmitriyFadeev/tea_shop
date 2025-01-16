import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import jwt from 'jsonwebtoken';

import { env } from '../env';
import type { TUserCtx } from './models/user.model';

export interface Context extends FetchCreateContextFnOptions {
  user?: TUserCtx;
}

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<Context> {
  const context: Context = opts;
  const token = opts.req.headers.get('authorization')?.split(' ')[1];
  if (token) {
    try {
      const userData = jwt.verify(token, env.JWT_SECRET) as TUserCtx;
      context.user = userData;
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  return context;
}
