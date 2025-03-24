import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeb3Dto {
  // Propriété pour la clé privée utilisée pour déployer ou interagir avec un contrat
  @IsString()
  @ApiProperty()
  readonly privateKey: string;

  // Propriété pour le nom du contrat ou du fichier (par exemple, GiBeeToken.json)
  @IsString()
  @ApiProperty()
  readonly contractFile: string;

  // Liste des arguments à passer au constructeur du contrat (par exemple, le totalSupply)
  @IsArray()
  @ApiProperty()
  readonly constructorArgs: any[];

  // Optionnel : propriété pour un total supply dans certains cas
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly totalSupply?: number;
}
