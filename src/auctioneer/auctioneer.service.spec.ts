import { Test, TestingModule } from '@nestjs/testing';
import { Auctioneer } from './auctioneer.service';

describe('AuctioneerService', () => {
  let service: Auctioneer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auctioneer],
    }).compile();

    service = module.get<Auctioneer>(Auctioneer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
