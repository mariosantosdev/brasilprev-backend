import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class HirePlanResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  @ApiProperty({ description: 'The id of the hired plan' })
  id: string;
}
