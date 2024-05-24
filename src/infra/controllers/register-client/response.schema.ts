import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class RegisterClientResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  id: string;
}
