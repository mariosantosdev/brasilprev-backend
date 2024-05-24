import { Test, TestingModule } from '@nestjs/testing';
import { InvestExtraContributionService } from './invest-extra-contribution.service';
import { InMemoryPlanRepository } from '@root/test/repositories/in-memory-plan.repository';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { makePlanFactory } from '@root/test/factories/make-plan.factory';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { PlanEntity } from '@/application/entities/plan.entity';

describe('InvestExtraContributionService', () => {
  let service: InvestExtraContributionService;
  let repository: InMemoryPlanRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestExtraContributionService,
        {
          provide: PlanRepository,
          useClass: InMemoryPlanRepository,
        },
      ],
    }).compile();

    service = module.get<InvestExtraContributionService>(
      InvestExtraContributionService,
    );
    repository = module.get(PlanRepository);
  });

  it('should invest extra contribution', async () => {
    const plan = makePlanFactory();
    const initialBalance = plan.balance;

    await repository.create(plan);

    const result = await service.execute({
      clientId: plan.client.id,
      planId: plan.id,
      extraContribution: 100,
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(PlanEntity);

    const updatedPlan = await repository.findById(plan.id);

    expect(updatedPlan.balance).toBe(initialBalance + 100);
  });

  it('should not invest extra contribution in an invalid plan', async () => {
    const result = await service.execute({
      clientId: 'wrong-client-id',
      planId: 'wrong-plan-id',
      extraContribution: 100,
    });

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundException);

    if (result.isLeft())
      expect(result.value.message).toContain('Plan not found');
  });
});
