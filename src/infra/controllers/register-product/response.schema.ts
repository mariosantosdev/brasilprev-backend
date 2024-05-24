import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class RegisterProductResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  id: string;
}
