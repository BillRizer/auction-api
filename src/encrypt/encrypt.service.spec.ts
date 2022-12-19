import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService, ConfigService],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate random hash with correct length', () => {
    const rand = service.rand(12);

    expect(rand.length).toBe(12);
  });

  it('should generate random hash in every invocation', () => {
    const rand_1 = service.rand(12);
    const rand_2 = service.rand(12);
    const rand_3 = service.rand(12);

    expect(rand_1).not.toEqual(rand_2);
    expect(rand_2).not.toEqual(rand_3);
    expect(rand_1).not.toEqual(rand_3);
  });
});
