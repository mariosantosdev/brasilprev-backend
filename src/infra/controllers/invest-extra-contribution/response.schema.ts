import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class InvestExtraContributionResponseSchema {
  @IsString()
  @IsUUID()
  @Expose()
  id: string;
}
