import { Test, TestingModule } from '@nestjs/testing';
import { HirePlanService } from './hire-plan.service';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { InMemoryPlanRepository } from '@root/test/repositories/in-memory-plan.repository';
import { ProductRepository } from '@/application/repositories/product.repository';
import { InMemoryProductRepository } from '@root/test/repositories/in-memory-product.repository';
import { ClientRepository } from '@/application/repositories/client.repository';
import { InMemoryClientRepository } from '@root/test/repositories/in-memory-client.repository';
import { PlanEntity } from '@/application/entities/plan.entity';
import { makeClientFactory } from '@root/test/factories/make-client.factory';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { makePlanFactory } from '@root/test/factories/make-plan.factory';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';

describe('HirePlanService', () => {
  let service: HirePlanService;
  let planRepository: InMemoryPlanRepository;
  let productRepository: InMemoryProductRepository;
  let clientRepository: InMemoryClientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HirePlanService,
        {
          provide: PlanRepository,
          useClass: InMemoryPlanRepository,
        },
        {
          provide: ProductRepository,
          useClass: InMemoryProductRepository,
        },
        {
          provide: ClientRepository,
          useClass: InMemoryClientRepository,
        },
      ],
    }).compile();

    service = module.get<HirePlanService>(HirePlanService);
    planRepository = module.get(PlanRepository);
    productRepository = module.get(ProductRepository);
    clientRepository = module.get(ClientRepository);
  });

  it('should hire a plan', async () => {
    expect(planRepository.items).toHaveLength(0);

    const client = makeClientFactory();

    await clientRepository.create(client);

    const product = makeProductFactory();

    await productRepository.create(product);

    const result = await service.execute({
      clientId: client.id,
      productId: product.id,
      contribution: product.minFirstContribution,
      hiredAt: new Date(),
      ageForRetirement: product.minAgeForBenefit + 5,
    });

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(PlanEntity);

    expect(planRepository.items).toHaveLength(1);
  });

  it('should not hire a plan twice', async () => {
    const client = makeClientFactory();

    await clientRepository.create(client);

    const product = makeProductFactory();

    await productRepository.create(product);

    const plan = makePlanFactory({ product, client });

    await planRepository.create(plan);

    expect(planRepository.items).toHaveLength(1);

    const result = await service.execute({
      clientId: client.id,
      productId: product.id,
      contribution: product.minFirstContribution,
      hiredAt: new Date(),
      ageForRetirement: product.minAgeForBenefit + 5,
    });

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ConflictResourceException);

    if (result.isLeft())
      expect(result.value.message).toContain('Plan already hired.');

    expect(planRepository.items).toHaveLength(1);
  });

  it('should not hire a plan to an invalid product', async () => {
    const client = makeClientFactory();

    await clientRepository.create(client);

    const result = await service.execute({
      clientId: client.id,
      productId: 'wrong-id',
      contribution: 0,
      hiredAt: new Date(),
      ageForRetirement: 0,
    });

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundException);

    if (result.isLeft())
      expect(result.value.message).toContain('Product not found');
  });

  it('should not hire a plan to an invalid client', async () => {
    const product = makeProductFactory();

    await productRepository.create(product);

    const result = await service.execute({
      clientId: 'wrong-id',
      productId: product.id,
      contribution: product.minFirstContribution,
      hiredAt: new Date(),
      ageForRetirement: product.minAgeForBenefit + 5,
    });

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundException);

    if (result.isLeft())
      expect(result.value.message).toContain('Client not found');
  });
});
