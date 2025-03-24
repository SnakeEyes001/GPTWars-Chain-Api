import { IsInt, IsString, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployCredDto {
  @IsString()
  @ApiProperty()
  readonly privateKey: string; // Clé privée de l'utilisateur

}
