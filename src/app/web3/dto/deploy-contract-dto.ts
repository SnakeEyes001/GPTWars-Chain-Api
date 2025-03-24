import { IsArray, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployContractDto {
  @IsString()
  @ApiProperty()
  readonly privateKey: string; // Clé privée de l'utilisateur

  @IsString()
  @ApiProperty()
  readonly contractFile: string; // Nom du fichier du contrat à déployer (ex : "GiBeeToken.json")

  @IsString()
  @ApiProperty()
  readonly contractAddress: string; // Nom du fichier du contrat à déployer (ex : "GiBeeToken.json")

  @IsArray()
  @ApiProperty()
  readonly constructorArgs: any[]; // Arguments à passer au constructeur du contrat
}
