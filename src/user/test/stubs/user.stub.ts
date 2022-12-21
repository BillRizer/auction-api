import { User } from '../../../user/entities/user.entity';

export const userStub = new User({
  email: 'test@example.com',
  id: 'asdaa-asda-sdas-das',
  credit: 0,
  name: 'Fake name',
  password: '$2b$10$Hg/aEemqbZJdtAwmlmr6x.5nUTJdc0JZTjrvQKlswdwiL8n19ohyC',
  createdAt: '',
  updatedAt: '',
  deletedAt: '',
});
