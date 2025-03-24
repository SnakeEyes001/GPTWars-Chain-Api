import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as fs from 'fs';
import * as path from 'path';
import { FileManager } from '../../utils/file-manager';
import { CreateAccountDto } from './dto/create-account-dto';

@Injectable()
export class Web3Service {
  private web3: Web3;

  constructor(private configService: ConfigService) {
    const networkUrl =
      this.configService.get<string>('NETWORK_URL') || `http://127.0.0.1:7545`;
    this.web3 = new Web3(networkUrl);
  }

  getWeb3Instance(): Web3 {
    if (!this.web3) {
      throw new Error(`Web3 instance is not initialized`);
    }
    return this.web3;
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<any> {
    try {
      const account = this.web3.eth.accounts.create();
      console.log(`Created account: ${account.address}`);
      return account;
    } catch (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }

  async getAllAccounts(): Promise<string[]> {
    try {
      const accounts = await this.web3.eth.getAccounts();
      return accounts;
    } catch (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }
  }

  async deployAllContracts(privateKey: string): Promise<{
    tokenAddress: string;
    lootboxAddress: string;
  }> {
    const abiPathToken = path.resolve(
      'src',
      'contractsABI',
      'GPTWarsToken.json',
    );
    const abiPathLootbox = path.resolve(
      'src',
      'contractsABI',
      'GPTWarsLootboxNFT.json',
    );

    // Charger les ABIs et bytecodes des contrats
    const tokenJson = JSON.parse(fs.readFileSync(abiPathToken, 'utf8'));
    const lootboxJson = JSON.parse(fs.readFileSync(abiPathLootbox, 'utf8'));

    const abiToken = tokenJson.abi as AbiItem[];
    const bytecodeToken = tokenJson.bytecode;

    const abiLootbox = lootboxJson.abi as AbiItem[];
    const bytecodeLootbox = lootboxJson.bytecode;

    // Créer un compte à partir de la clé privée
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(account);
    this.web3.eth.defaultAccount = account.address;

    // Déployer le contrat GPTWarsToken
    const tokenContract = new this.web3.eth.Contract(abiToken);
    const tokenDeployed = await tokenContract
      .deploy({
        data: bytecodeToken,
        arguments: [],
      })
      .send({
        from: account.address,
      });

    console.log(
      `GPTWarsToken déployé à l'adresse: ${tokenDeployed.options.address}`,
    );
    const tokenAddress = tokenDeployed.options.address;

    // Déployer le contrat GPTWarsLootboxNFT
    const lootboxContract = new this.web3.eth.Contract(abiLootbox);
    const lootboxDeployed = await lootboxContract
      .deploy({
        data: bytecodeLootbox,
        arguments: [tokenAddress], // Passer l'adresse du token
      })
      .send({
        from: account.address,
      });

    console.log(
      `GPTWarsLootboxNFT déployé à l'adresse: ${lootboxDeployed.options.address}`,
    );
    const lootboxAddress = lootboxDeployed.options.address;

    // Sauvegarder les adresses dans un fichier
    const fileManager = new FileManager();
    const addresses = {
      tokenAddress: tokenAddress,
      lootboxAddress: lootboxAddress,
    };
    fileManager.writeToFile(JSON.stringify(addresses));

    // Retourner les adresses des contrats
    return addresses;
  }
}
