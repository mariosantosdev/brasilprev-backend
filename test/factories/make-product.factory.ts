import { ProductEntity } from '@/application/entities/product.entity';
import { faker } from '@faker-js/faker';

export function makeProductFactory(
  overrides?: Partial<ProductEntity>,
): ProductEntity {
  const product = ProductEntity.create({
    name: overrides?.name ?? faker.commerce.productName(),

    susep: overrides?.susep ?? faker.string.uuid(),

    endDateToBuy: overrides?.endDateToBuy ?? faker.date.future(),

    minFirstContribuition:
      overrides?.minFirstContribuition ??
      faker.number.float({ fractionDigits: 2 }),

    minExtraContribuition:
      overrides?.minExtraContribuition ??
      faker.number.float({ fractionDigits: 2 }),

    minAgeForContract:
      overrides?.minAgeForContract ?? faker.number.int({ min: 18, max: 27 }),

    minAgeForBenefit:
      overrides?.minAgeForBenefit ?? faker.number.int({ min: 27 }),

    firstWithdrawalPeriod:
      overrides?.firstWithdrawalPeriod ?? faker.number.int(),

    withdrawalPeriod: overrides?.withdrawalPeriod ?? faker.number.int(),
  });

  return product.value as ProductEntity;
}
