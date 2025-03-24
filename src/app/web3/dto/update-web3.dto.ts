import { PartialType } from '@nestjs/mapped-types';
import { CreateWeb3Dto } from './create-web3.dto';

export class UpdateWeb3Dto extends PartialType(CreateWeb3Dto) {}
