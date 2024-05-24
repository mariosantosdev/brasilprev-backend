import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class WithdrawContributionRequestSchema {
  @IsString()
  @IsUUID()
  idPlano: string;

  @IsNumber()
  @IsPositive()
  valorResgate: number;
}
