import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class RegisterClientResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  @ApiProperty({ description: 'The id of the registered client' })
  id: string;
}
