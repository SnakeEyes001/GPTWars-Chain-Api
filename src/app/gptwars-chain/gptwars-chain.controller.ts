import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { GPTWarsChainService } from './gptwars-chain.service';
import { BuyTokensDto } from './dto/BuyTokensDto';
import { MintLootboxDto } from './dto/MintLootboxDto';
import { OpenLootboxDto } from './dto/OpenLootboxDto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('GPTWarsChain')
@Controller('gptwars-chain')
export class GPTWarsChainController {
  private readonly logger = new Logger(GPTWarsChainController.name);

  constructor(private readonly gptWarsChainService: GPTWarsChainService) {}

  //Obtenir le solde d'un utilisateur
  @Get('user-balance/:userAddress')
  @ApiParam({ name: 'userAddress', required: true, type: 'string' })
  async getUserBalance(
    @Param('userAddress') userAddress: string,
  ): Promise<string> {
    this.logger.log(`Fetching balance for user: ${userAddress}`);
    return this.gptWarsChainService.getUserBalance(userAddress);
  }

  //Mint des tokens pour un utilisateur
  @Post('mint-tokens')
  async mintTokens(
    @Body()
    {
      to,
      amount,
      ownerAddress,
    }: {
      to: string;
      amount: string;
      ownerAddress: string;
    },
  ): Promise<void> {
    this.logger.log(`Minting ${amount} tokens to ${to} from ${ownerAddress}`);
    await this.gptWarsChainService.mintTokens(to, amount, ownerAddress);
  }

  //Brûler des tokens d'un utilisateur
  @Post('burn-tokens')
  async burnTokens(
    @Body() { amount, userAddress }: { amount: string; userAddress: string },
  ): Promise<void> {
    this.logger.log(`Burning ${amount} tokens from ${userAddress}`);
    await this.gptWarsChainService.burnTokens(amount, userAddress);
  }

  //Acheter des lootboxes
  @Post('buy-lootboxes')
  async buyLootboxes(
    @Body()
    {
      quantity,
      lootboxLevel,
      userAddress,
    }: {
      quantity: number;
      lootboxLevel: number;
      userAddress: string;
    },
  ): Promise<void> {
    this.logger.log(
      `User ${userAddress} buying ${quantity} lootboxes of level ${lootboxLevel}`,
    );
    await this.gptWarsChainService.buyLootboxes(
      quantity,
      lootboxLevel,
      userAddress,
    );
  }

  //Ouvrir une lootbox d'un niveau spécifique
  @Post('open-lootbox')
  async openLootbox(
    @Body()
    {
      userAddress,
      lootboxLevel,
    }: {
      userAddress: string;
      lootboxLevel: number;
    },
  ): Promise<void> {
    this.logger.log(
      `User ${userAddress} opening lootbox of level ${lootboxLevel}`,
    );
    await this.gptWarsChainService.openLootbox(userAddress, lootboxLevel);
  }

  //Ouvrir une lootbox spécifique
  @Post('open-one-lootbox')
  async openOneLootbox(
    @Body()
    { userAddress, lootboxName }: { userAddress: string; lootboxName: string },
  ): Promise<void> {
    this.logger.log(`User ${userAddress} opening lootbox ${lootboxName}`);
    await this.gptWarsChainService.openOneLootbox(userAddress, lootboxName);
  }

  //Créer un NFT
  @Post('create-nft')
  async createNFT(
    @Body()
    {
      userAddress,
      metadataURI,
      ownerAddress,
    }: {
      userAddress: string;
      metadataURI: string;
      ownerAddress: string;
    },
  ): Promise<void> {
    this.logger.log(
      `Creating NFT for ${userAddress} with metadata ${metadataURI}`,
    );
    await this.gptWarsChainService.createNFT(
      userAddress,
      metadataURI,
      ownerAddress,
    );
  }

  //Créer une lootbox
  @Post('create-lootbox')
  async createLootbox(
    @Body()
    {
      name,
      level,
      price,
      metadataURI,
      ownerAddress,
    }: {
      name: string;
      level: number;
      price: string;
      metadataURI: string;
      ownerAddress: string;
    },
  ): Promise<void> {
    this.logger.log(
      `Creating lootbox ${name} (level ${level}) with price ${price}`,
    );
    await this.gptWarsChainService.createLootbox(
      name,
      level,
      price,
      metadataURI,
      ownerAddress,
    );
  }

  //Retirer les tokens accumulés par le contrat vers l'owner
  @Post('withdraw-tokens')
  async withdrawTokens(
    @Body() { ownerAddress }: { ownerAddress: string },
  ): Promise<void> {
    this.logger.log(`Withdrawing tokens for owner: ${ownerAddress}`);
    await this.gptWarsChainService.withdrawTokens(ownerAddress);
  }

  //Récupérer toutes les lootboxes d'un utilisateur
  @Get('user-lootboxes/:userAddress')
  @ApiParam({ name: 'userAddress', required: true, type: 'string' })
  async getUserLootboxes(
    @Param('userAddress') userAddress: string,
  ): Promise<number[]> {
    this.logger.log(`Fetching lootboxes for user: ${userAddress}`);
    return this.gptWarsChainService.getUserLootboxes(userAddress);
  }

  //Récupérer toutes les lootboxes existantes sur la blockchain
  @Get('all-lootboxes')
  async getAllLootboxes(): Promise<any[]> {
    this.logger.log(`Fetching all lootboxes from blockchain`);
    return this.gptWarsChainService.getAllLootboxes();
  }
}
