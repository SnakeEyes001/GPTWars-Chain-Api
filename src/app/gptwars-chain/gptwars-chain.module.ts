import { Module } from '@nestjs/common';
import { GPTWarsChainService } from './gptwars-chain.service';
import { GPTWarsChainController } from './gptwars-chain.controller';
import { Web3Service } from '../web3/web3.service';
import { Web3Controller } from '../web3/web3.controller';

@Module({
  controllers: [GPTWarsChainController, Web3Controller],
  providers: [GPTWarsChainService, Web3Service],
})
export class GptwarsChainModule {}
