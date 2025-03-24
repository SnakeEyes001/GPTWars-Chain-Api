import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Web3 from 'web3';
import * as GPTWarsTokenContract from '../../contractsABI/GPTWarsToken.json';
//import GPTWarsTokenContract = require('../../contractsABI/GPTWarsToken.json');
//import GPTWarsLootboxNFTContract = require('../../contractsABI/GPTWarsLootboxNFT.json');
import * as GPTWarsLootboxNFTContract from '../../contractsABI/GPTWarsLootboxNFT.json';
import { Web3Service } from '../web3/web3.service';
import BN from 'bn.js';
//import * as Creds from '../../config/credentials.json';
@Injectable()
export class GPTWarsChainService implements OnModuleInit {
  private readonly logger = new Logger(GPTWarsChainService.name);

  private web3: Web3;
  private accounts: string[];

  private GPTWarsToken: any;
  private GPTWarsLootboxNFT: any;

  constructor(private readonly web3Service: Web3Service) {
    this.web3 = this.web3Service.getWeb3Instance();
  }

  // Méthode d'initialisation des contrats qui sera appelée par onModuleInit
  async onModuleInit() {
    this.logger.log('onModuleInit() started');
    await this.initializeContracts();
    this.logger.log('onModuleInit() completed');
  }

  // Méthode pour initialiser les contrats
  private async initializeContracts() {
    try {
      // Récupérer les comptes disponibles dans Web3
      this.accounts = await this.web3.eth.getAccounts();
      const networkId = (await this.web3.eth.net.getId()).toString();
      this.logger.log(`Network ID: ${networkId}`);

      // Récupérer l'adresse du contrat GPTWarsToken
      const tokenAddress = GPTWarsTokenContract.networks[networkId]?.address;
      if (!tokenAddress) {
        throw new Error(
          `GPTWarsToken contract address not found for networkId: ${networkId}`,
        );
      }

      // Initialisation du contrat GPTWarsToken
      this.GPTWarsToken = new this.web3.eth.Contract(
        GPTWarsTokenContract.abi,
        tokenAddress,
      );
      this.logger.log(
        `GPTWarsToken contract initialized at address: ${this.GPTWarsToken.options.address}`,
      );

      // Récupérer l'adresse du contrat GPTWarsLootboxNFT
      const lootboxAddress =
        GPTWarsLootboxNFTContract.networks[networkId]?.address;
      if (!lootboxAddress) {
        throw new Error(
          `GPTWarsLootboxNFT contract address not found for networkId: ${networkId}`,
        );
      }

      // Initialisation du contrat GPTWarsLootboxNFT
      this.GPTWarsLootboxNFT = new this.web3.eth.Contract(
        GPTWarsLootboxNFTContract.abi,
        lootboxAddress,
      );
      this.logger.log(
        `GPTWarsLootboxNFT contract initialized at address: ${this.GPTWarsLootboxNFT.options.address}`,
      );

      this.logger.log('Contracts initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing contracts', error.stack);
      throw error; // On relance l'erreur pour que NestJS la gère
    }
  }

  async getUserBalance(userAddress: string): Promise<string> {
    console.log(userAddress);
    const balance = await this.GPTWarsToken.methods
      .balanceOf(userAddress)
      .call();
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async mintTokens(
    to: string,
    amount: string,
    ownerAddress: string,
  ): Promise<void> {
    const amountWei = this.web3.utils.toWei(amount, 'ether');
    const gas = await this.GPTWarsToken.methods
      .mint(to, amountWei)
      .estimateGas({ from: ownerAddress });

    await this.GPTWarsToken.methods
      .mint(to, amountWei)
      .send({ from: ownerAddress, gas });
  }

  async burnTokens(amount: string, userAddress: string): Promise<void> {
    const amountWei = this.web3.utils.toWei(amount, 'ether');
    const gas = await this.GPTWarsToken.methods
      .burn(amountWei)
      .estimateGas({ from: userAddress });

    await this.GPTWarsToken.methods
      .burn(amountWei)
      .send({ from: userAddress, gas });
  }

  async buyLootboxes(
    quantity: number,
    lootboxLevel: number,
    userAddress: string,
  ): Promise<void> {
    const price = await this.GPTWarsLootboxNFT.methods
      .lootboxTypes(lootboxLevel)
      .call();
    const totalCost = new BN(price.price).mul(new BN(quantity.toString()));

    const gasTransfer = await this.GPTWarsToken.methods
      .transfer(this.GPTWarsLootboxNFT.options.address, totalCost.toString())
      .estimateGas({ from: userAddress });

    await this.GPTWarsToken.methods
      .transfer(this.GPTWarsLootboxNFT.options.address, totalCost.toString())
      .send({ from: userAddress, gas: gasTransfer });

    const gasBuy = await this.GPTWarsLootboxNFT.methods
      .buyLootboxes(quantity, lootboxLevel)
      .estimateGas({ from: userAddress });

    await this.GPTWarsLootboxNFT.methods
      .buyLootboxes(quantity, lootboxLevel)
      .send({ from: userAddress, gas: gasBuy });
  }

  async openLootbox(userAddress: string, lootboxLevel: number): Promise<void> {
    const gas = await this.GPTWarsLootboxNFT.methods
      .openLootbox(lootboxLevel)
      .estimateGas({ from: userAddress });

    await this.GPTWarsLootboxNFT.methods
      .openLootbox(lootboxLevel)
      .send({ from: userAddress, gas });
  }

  async openOneLootbox(
    userAddress: string,
    lootboxName: string,
  ): Promise<void> {
    const gas = await this.GPTWarsLootboxNFT.methods
      .openOneLootbox(lootboxName)
      .estimateGas({ from: userAddress });

    await this.GPTWarsLootboxNFT.methods
      .openOneLootbox(lootboxName)
      .send({ from: userAddress, gas });
  }

  async createNFT(
    userAddress: string,
    metadataURI: string,
    ownerAddress: string,
  ): Promise<void> {
    const gas = await this.GPTWarsLootboxNFT.methods
      .createNFT(userAddress, metadataURI)
      .estimateGas({ from: ownerAddress });

    await this.GPTWarsLootboxNFT.methods
      .createNFT(userAddress, metadataURI)
      .send({ from: ownerAddress, gas });
  }

  async createLootbox(
    name: string,
    level: number,
    price: string,
    metadataURI: string,
    ownerAddress: string,
  ): Promise<void> {
    const priceWei = this.web3.utils.toWei(price, 'ether');
    const gas = await this.GPTWarsLootboxNFT.methods
      .createLootbox(name, level, priceWei, metadataURI)
      .estimateGas({ from: ownerAddress });

    await this.GPTWarsLootboxNFT.methods
      .createLootbox(name, level, priceWei, metadataURI)
      .send({ from: ownerAddress, gas });
  }

  async withdrawTokens(ownerAddress: string): Promise<void> {
    const gas = await this.GPTWarsLootboxNFT.methods
      .withdraw()
      .estimateGas({ from: ownerAddress });

    await this.GPTWarsLootboxNFT.methods
      .withdraw()
      .send({ from: ownerAddress, gas });
  }

  async getUserLootboxes(userAddress: string): Promise<number[]> {
    return await this.GPTWarsLootboxNFT.methods
      .getLootboxNFTs(userAddress)
      .call();
  }

  async getAllLootboxes(): Promise<any[]> {
    return await this.GPTWarsLootboxNFT.methods.getAllLootboxes().call();
  }
}

/* import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Web3 from 'web3';
import * as GPTWarsTokenContract from '../../contractsABI/GPTWarsToken.json';
import * as GPTWarsLootboxNFTContract from '../../contractsABI/ERC721URIStorage.json';
import { Web3Service } from '../web3/web3.service';
import BN from 'bn.js'; // Import de BN.js

@Injectable()
export class GPTWarsChainService implements OnModuleInit {
  private readonly logger = new Logger(GPTWarsChainService.name);

  private web3: Web3;
  private accounts: string[];

  private GPTWarsToken: any;
  private GPTWarsLootboxNFT: any;

  constructor(private readonly web3Service: Web3Service) {
    this.web3 = this.web3Service.getWeb3Instance(); // Connexion au réseau Ethereum
  }

  async onModuleInit() {
    await this.initializeContracts();
  }

  private async initializeContracts() {
    this.accounts = await this.web3.eth.getAccounts();
    const networkId = (await this.web3.eth.net.getId()).toString(); // Conversion de bigint en string

    // Initialisation du contrat GPTWarsToken
    this.GPTWarsToken = new this.web3.eth.Contract(
      GPTWarsTokenContract.abi,
      GPTWarsTokenContract.networks[networkId]?.address, // Utilisation sécurisée
    );

    // Initialisation du contrat GPTWarsLootboxNFT
    this.GPTWarsLootboxNFT = new this.web3.eth.Contract(
      GPTWarsLootboxNFTContract.abi,
      GPTWarsLootboxNFTContract.networks[networkId]?.address,
    );

    this.logger.log('Contracts initialized successfully');
    this.logger.log(
      `GPTWarsToken Address: ${this.GPTWarsToken.options.address}`,
    );
    this.logger.log(
      `GPTWarsLootboxNFT Address: ${this.GPTWarsLootboxNFT.options.address}`,
    );
  }

  // Récupérer le solde d'un utilisateur pour GPTWarsToken
  async getUserBalance(userAddress: string): Promise<string> {
    const balance = await this.GPTWarsToken.methods
      .balanceOf(userAddress)
      .call();
    return this.web3.utils.fromWei(balance, 'ether');
  }

  // Acheter des tokens GPTWarsToken
  async buyTokens(tokensToBuy: number, investorAddress: string): Promise<void> {
    const tokenPrice = await this.GPTWarsToken.methods.tokenPrice().call();

    // Utilisation de BN.js pour gérer les grands nombres
    const totalCost = new BN(tokenPrice).mul(new BN(tokensToBuy.toString()));

    await this.GPTWarsToken.methods
      .buyTokens(tokensToBuy)
      .send({ from: investorAddress, value: totalCost.toString() });

    this.logger.log(`Investor ${investorAddress} bought ${tokensToBuy} GPT.`);
  }

  // Déployer des Lootboxes NFT (par exemple, acheter ou mint un NFT)
  async mintLootboxNFT(userAddress: string, tokenId: number): Promise<void> {
    await this.GPTWarsLootboxNFT.methods
      .mintLootboxNFT(userAddress, tokenId)
      .send({ from: userAddress });

    this.logger.log(
      `User ${userAddress} minted LootboxNFT with ID: ${tokenId}`,
    );
  }

  // Ouvrir un Lootbox NFT (fonction pour interagir avec la lootbox)
  async openLootboxNFT(userAddress: string, tokenId: number): Promise<void> {
    await this.GPTWarsLootboxNFT.methods
      .openLootboxNFT(userAddress, tokenId)
      .send({ from: userAddress });

    this.logger.log(
      `User ${userAddress} opened LootboxNFT with ID: ${tokenId}`,
    );
  }

  // Récupérer toutes les lootboxes d'un utilisateur
  async getUserLootboxes(userAddress: string): Promise<any[]> {
    const lootboxes = await this.GPTWarsLootboxNFT.methods
      .getUserLootboxes(userAddress)
      .call();

    this.logger.log(`Fetched lootboxes for user ${userAddress}.`);
    return lootboxes;
  }

  // Terminer l'ICO (si applicable, ou autre logique de fin d'événement)
  async terminateICO(ownerAddress: string): Promise<void> {
    await this.GPTWarsToken.methods.terminateICO().send({ from: ownerAddress });

    const ownerBalance = await this.web3.eth.getBalance(ownerAddress);
    this.logger.log(
      `ICO terminated. Owner ETH balance: ${this.web3.utils.fromWei(ownerBalance, 'ether')} ETH.`,
    );
  }
}
 */
