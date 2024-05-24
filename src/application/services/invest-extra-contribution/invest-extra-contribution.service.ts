import { PlanEntity } from '@/application/entities/plan.entity';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { Injectable } from '@nestjs/common';

interface RequestParams {
  clientId: string;
  planId: string;
  extraContribution: number;
}

@Injectable()
export class InvestExtraContributionService {
  constructor(private planRepository: PlanRepository) {}

  async execute({
    clientId,
    planId,
    extraContribution,
  }: RequestParams): Promise<Either<DomainException, PlanEntity>> {
    const plan = await this.planRepository.findByIdAndClientId(
      planId,
      clientId,
    );

    if (!plan) return left(new ResourceNotFoundException('Plan not found'));

    const deposited = plan.deposit(extraContribution);

    if (deposited.isLeft()) return left(deposited.value);

    await this.planRepository.update(plan);

    return right(null);
  }
}
