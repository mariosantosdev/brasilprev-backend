import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class WithdrawContributionResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  id: string;
}
