import { faker } from '@faker-js/faker';
import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  const baseProps = {
    name: faker.commerce.productName(),
    susep: faker.string.uuid(),
    endDateToBuy: faker.date.future(),
    minFirstContribuition: faker.number.float({ fractionDigits: 2 }),
    minExtraContribuition: faker.number.float({ fractionDigits: 2 }),
    minAgeForContract: faker.number.int({ max: 21 }),
    minAgeForBenefit: faker.number.int({ min: 21 }),
    firstWithdrawalPeriod: faker.number.int(),
    withdrawalPeriod: faker.number.int(),
  };

  it('should valid properties entries', () => {
    const result = ProductEntity.validate(baseProps);

    expect(result).toBeTruthy();
  });

  it('should not valid properties if minAgeForBenefit is less than minAgeForContract', () => {
    const result = ProductEntity.validate({
      ...baseProps,
      minAgeForContract: 20,
      minAgeForBenefit: 18,
    });

    expect(result).toBeFalsy();
  });

  it('should not valid properties if endDateToBuy is in the past', () => {
    const result = ProductEntity.validate({
      ...baseProps,
      endDateToBuy: faker.date.past(),
    });

    expect(result).toBeFalsy();
  });
});
