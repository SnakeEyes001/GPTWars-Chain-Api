import { ApiProperty } from '@nestjs/swagger';

export class BuyTokensDto {
  @ApiProperty({ description: 'The number of tokens to buy' })
  tokensToBuy: number;

  @ApiProperty({ description: 'The address of the investor' })
  investorAddress: string;
}
