import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class InvestExtraContributionRequestSchema {
  @IsString()
  @IsUUID()
  @ApiProperty({ description: 'Id of the client' })
  idCliente: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ description: 'Id of the plan' })
  idPlano: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The amount of the extra contribution' })
  valorAporte: number;
}
