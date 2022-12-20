import { Request } from 'express';
import { IJwtBody } from './jwt-response.interface';

interface RequestWithUser extends Request {
  user: IJwtBody;
}

export default RequestWithUser;
