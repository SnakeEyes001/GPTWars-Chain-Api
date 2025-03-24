import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @IsOptional()
  @ApiProperty()
  readonly name?: string; // Facultatif : on peut ajouter des métadonnées sur le compte
}
