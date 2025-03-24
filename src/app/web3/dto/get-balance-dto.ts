import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceDto {
  @IsString()
  @ApiProperty()
  readonly address: string; // Adresse Ethereum dont on veut obtenir le solde
}
