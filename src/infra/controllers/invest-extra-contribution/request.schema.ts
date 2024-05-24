import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class InvestExtraContributionRequestSchema {
  @IsString()
  @IsUUID()
  idCliente: string;

  @IsString()
  @IsUUID()
  idPlano: string;

  @IsNumber()
  @IsPositive()
  valorAporte: number;
}
