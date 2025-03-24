import { Test, TestingModule } from '@nestjs/testing';
import { GPTWarsChainService } from './gptwars-chain.service';

describe('GptwarsChainService', () => {
  let service: GPTWarsChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GPTWarsChainService],
    }).compile();

    service = module.get<GPTWarsChainService>(GPTWarsChainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
