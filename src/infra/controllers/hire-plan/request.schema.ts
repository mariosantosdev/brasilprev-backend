import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class HirePlanRequestSchema {
  @IsString()
  @IsUUID()
  @ApiProperty({ description: 'The id of the client' })
  idCliente: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ description: 'The id of the product' })
  idProduto: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The amount of the first contribution' })
  aporte: number;

  @IsDateString()
  @ApiProperty({ description: 'The date of the hiring' })
  dataDaContratacao: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The age for retirement' })
  idadeDeAposentadoria: number;
}
