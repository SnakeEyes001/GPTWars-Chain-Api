import { Controller, Post, Body, Get } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { CreateAccountDto } from './dto/create-account-dto';
import { DeployCredDto } from './dto/deploy-cred-dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Web3 routes')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  // Route pour créer un compte Ethereum
  @Post('create-account')
  @ApiBody({
    type: CreateAccountDto,
  })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.web3Service.createAccount(createAccountDto);
  }

  // Route pour obtenir tous les comptes Ethereum
  @Get('accounts')
  async getAllAccounts() {
    return this.web3Service.getAllAccounts();
  }

  // Route pour déployer les contrats GPTWarsToken et GPTWarsLootboxNFT
  @Post('deploy-contracts')
  @ApiBody({
    type: DeployCredDto,
  })
  async deployContracts(@Body() deployCredDto: DeployCredDto) {
    const { privateKey } = deployCredDto;
    return this.web3Service.deployAllContracts(privateKey);
  }
}
