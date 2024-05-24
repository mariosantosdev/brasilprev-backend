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
  idCliente: string;

  @IsString()
  @IsUUID()
  idProduto: string;

  @IsNumber()
  @IsPositive()
  aporte: number;

  @IsDateString()
  dataDaContratacao: string;

  @IsNumber()
  @IsPositive()
  idadeDeAposentadoria: number;
}
