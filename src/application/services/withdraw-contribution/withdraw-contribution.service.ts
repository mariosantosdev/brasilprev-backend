import { PlanEntity } from '@/application/entities/plan.entity';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { Injectable } from '@nestjs/common';

interface RequestParams {
  planId: string;
  withdrawalAmount: number;
}

@Injectable()
export class WithdrawContributionService {
  constructor(private planRepository: PlanRepository) {}

  async execute({
    planId,
    withdrawalAmount,
  }: RequestParams): Promise<Either<DomainException, PlanEntity>> {
    const plan = await this.planRepository.findById(planId);

    if (!plan) return left(new ResourceNotFoundException('Plan not found.'));

    const withdrawn = plan.withdraw(withdrawalAmount);

    if (withdrawn.isLeft()) return left(withdrawn.value);

    await this.planRepository.update(plan);

    return right(plan);
  }
}
