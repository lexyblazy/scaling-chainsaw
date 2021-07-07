import { SessionEntity } from './schemas/types';

declare global {
  namespace Express {
    interface Request {
      session: SessionEntity;
    }
  }
}
