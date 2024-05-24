import { BaseRepository } from '@/commons/interfaces/base.repository';
import { PlanEntity } from '../entities/plan.entity';

export abstract class PlanRepository extends BaseRepository<PlanEntity> {
  abstract findByProductIdAndClientId(
    productId: string,
    clientId: string,
  ): Promise<PlanEntity | null>;

  abstract findByIdAndClientId(
    id: string,
    clientId: string,
  ): Promise<PlanEntity | null>;
}
