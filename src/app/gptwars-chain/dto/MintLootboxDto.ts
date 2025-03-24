import { ApiProperty } from '@nestjs/swagger';

export class MintLootboxDto {
  @ApiProperty({ description: 'The address of the user' })
  userAddress: string;

  @ApiProperty({ description: 'The ID of the lootbox NFT to mint' })
  tokenId: number;
}
