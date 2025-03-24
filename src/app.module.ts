import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { WalletModule } from './app/wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';

import { Web3Service } from './app/web3/web3.service';

import { Web3Module } from './app/web3/web3.module';

import { Web3Controller } from './app/web3/web3.controller';
import { GPTWarsChainController } from './app/gptwars-chain/gptwars-chain.controller';
import { GptwarsChainModule } from './app/gptwars-chain/gptwars-chain.module';
import { GPTWarsChainService } from './app/gptwars-chain/gptwars-chain.service';

@Module({
  imports: [
    //ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // Permet d'utiliser ConfigService sans réimporter ConfigModule dans chaque module
    }),
    Web3Module,
    GptwarsChainModule,
  ],
  controllers: [AppController, Web3Controller, GPTWarsChainController],
  providers: [AppService, Web3Service, GPTWarsChainService],
})
export class AppModule {}
