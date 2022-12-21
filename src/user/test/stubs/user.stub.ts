import { User } from '../../../user/entities/user.entity';

const user = new User({
  email: 'email@email.com',
  id: 'asdaa-asda-sdas-das',
  credit: 0,
  name: 'Fake name',
  password: 'pass',
  createdAt: '',
  updatedAt: '',
  deletedAt: '',
});

export const userStub = user;

const { email, id, credit, name, password, createdAt, updatedAt, deletedAt } =
  user;
export const userProfileStub = new User({
  name,
  email,
  credit,
  createdAt,
  updatedAt,
  deletedAt,
});
