import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class HirePlanResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  id: string;
}
