import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class RegisterProductRequestSchema {
  @IsString()
  @ApiProperty({ description: 'The name of the product' })
  nome: string;

  @IsString()
  @ApiProperty({ description: 'The susep code of the product' })
  susep: string;

  @IsDateString()
  @ApiProperty({ description: 'The date of the end of the sale' })
  expiracaoDeVenda: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'The minimum amount of the initial contribution',
  })
  valorMinimoAporteInicial: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({ description: 'The minimum amount of the extra contribution' })
  valorMinimoAporteExtra: number;

  @IsNumber()
  @ApiProperty({ description: 'The minimum age to hire the product' })
  idadeDeEntrada: number;

  @IsNumber()
  @ApiProperty({ description: 'The initial age for retirement' })
  idadeDeSaida: number;

  @IsNumber()
  @ApiProperty({ description: 'The time to wait for the first withdrawal' })
  carenciaInicialDeResgate: number;

  @IsNumber()
  @ApiProperty({ description: 'The time to wait between withdrawals' })
  carenciaEntreResgates: number;
}
