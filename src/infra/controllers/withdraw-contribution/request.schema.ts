import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class WithdrawContributionRequestSchema {
  @IsString()
  @IsUUID()
  @ApiProperty({ description: 'The id of the plan' })
  idPlano: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The amount to be withdrawn' })
  valorResgate: number;
}
