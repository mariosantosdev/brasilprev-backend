import { IsDateString, IsNumber, IsString } from 'class-validator';

export class RegisterProductRequestSchema {
  @IsString()
  nome: string;

  @IsString()
  susep: string;

  @IsDateString()
  expiracaoDeVenda: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  valorMinimoAporteInicial: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  valorMinimoAporteExtra: number;

  @IsNumber()
  idadeDeEntrada: number;

  @IsNumber()
  idadeDeSaida: number;

  @IsNumber()
  carenciaInicialDeResgate: number;

  @IsNumber()
  carenciaEntreResgates: number;
}
