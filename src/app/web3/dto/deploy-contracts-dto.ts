import { IsInt, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployContractsDto {
  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly totalSupply: number; // Total supply du token à déployer
}
