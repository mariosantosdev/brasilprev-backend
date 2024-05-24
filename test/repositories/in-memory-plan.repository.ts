import { PlanEntity } from '@/application/entities/plan.entity';
import { PlanRepository } from '@/application/repositories/plan.repository';

export class InMemoryPlanRepository extends PlanRepository {
  items: PlanEntity[] = [];

  async create(plan: PlanEntity): Promise<PlanEntity> {
    this.items.push(plan);
    return plan;
  }

  async findById(id: string): Promise<PlanEntity> {
    return this.items.find((plan) => plan.id === id);
  }

  async findByProductIdAndClientId(
    productId: string,
    clientId: string,
  ): Promise<PlanEntity | null> {
    return this.items.find(
      (plan) => plan.productId === productId && plan.clientId === clientId,
    );
  }

  async update(plan: PlanEntity): Promise<PlanEntity> {
    const index = this.items.findIndex((item) => item.id === plan.id);
    this.items[index] = plan;
    return plan;
  }
}
