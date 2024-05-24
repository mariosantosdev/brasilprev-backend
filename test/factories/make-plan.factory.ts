import { PlanEntity } from '@/application/entities/plan.entity';
import { faker } from '@faker-js/faker';
import { makeClientFactory } from './make-client.factory';
import { makeProductFactory } from './make-product.factory';

type OverridesParams = Partial<Omit<PlanEntity, 'age'>>;

export function makePlanFactory(overrides?: OverridesParams): PlanEntity {
  const product = overrides?.product ?? makeProductFactory();

  const client =
    overrides?.client ??
    makeClientFactory({
      birthDate: faker.date.birthdate({
        mode: 'age',
        min: product.minAgeForContract,
      }),
    });

  const plan = PlanEntity.create(
    {
      ageForRetirement: faker.number.int({ min: product.minAgeForBenefit }),

      client,

      clientId: client.id,

      firstContribution: faker.number.float({
        fractionDigits: 2,
        min: product.minFirstContribution,
      }),

      hiredAt: faker.date.past(),

      product,

      productId: product.id,
    },
    overrides?.id,
  );

  return plan.value as PlanEntity;
}
