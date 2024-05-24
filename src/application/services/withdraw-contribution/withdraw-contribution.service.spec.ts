import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawContributionService } from './withdraw-contribution.service';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { InMemoryPlanRepository } from '@root/test/repositories/in-memory-plan.repository';
import { makePlanFactory } from '@root/test/factories/make-plan.factory';
import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';

describe('WithdrawContributionService', () => {
  let service: WithdrawContributionService;
  let repository: InMemoryPlanRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawContributionService,
        {
          provide: PlanRepository,
          useClass: InMemoryPlanRepository,
        },
      ],
    }).compile();

    service = module.get<WithdrawContributionService>(
      WithdrawContributionService,
    );
    repository = module.get(PlanRepository);
  });

  it('should withdraw a contribution', async () => {
    const plan = makePlanFactory({
      product: makeProductFactory({
        minExtraContribution: 100,
        firstWithdrawalPeriod: 0,
      }),
    });

    plan.deposit(100);

    const initialBalance = plan.balance;

    await repository.create(plan);

    const result = await service.execute({
      planId: plan.id,
      withdrawalAmount: 50,
    });

    expect(result.isRight()).toBeTruthy();

    const updatedPlan = await repository.findById(plan.id);

    expect(updatedPlan.balance).toBe(initialBalance - 50);
  });

  it('should not withdraw a contribution from invalid plan', async () => {
    const result = await service.execute({
      planId: 'invalid-id',
      withdrawalAmount: 50,
    });

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundException);
  });
});
