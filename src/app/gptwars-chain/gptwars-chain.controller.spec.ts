import { Test, TestingModule } from '@nestjs/testing';
import { GptwarsChainController } from './gptwars-chain.controller';
import { GptwarsChainService } from './gptwars-chain.service';

describe('GptwarsChainController', () => {
  let controller: GptwarsChainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptwarsChainController],
      providers: [GptwarsChainService],
    }).compile();

    controller = module.get<GptwarsChainController>(GptwarsChainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
