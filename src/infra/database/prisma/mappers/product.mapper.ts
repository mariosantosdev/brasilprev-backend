import { ProductEntity } from '@/application/entities/product.entity';
import { Prisma, Product } from '@prisma/client';

export class ProductMapper {
  static toPrisma(raw: ProductEntity): Prisma.ProductUncheckedCreateInput {
    return {
      id: raw.id,
      name: raw.name,
      susep: raw.susep,
      endDateToHire: raw.endDateToHire,
      firstWithdrawalPeriod: raw.firstWithdrawalPeriod,
      minAgeForBenefit: raw.minAgeForBenefit,
      minAgeForContract: raw.minAgeForContract,
      minExtraContribution: raw.minExtraContribution,
      minFirstContribution: raw.minFirstContribution,
      withdrawalPeriod: raw.withdrawalPeriod,
    };
  }

  static toDomain(raw: Product): ProductEntity {
    const productOrError = ProductEntity.create(raw, raw.id);

    if (productOrError.isLeft()) {
      throw new Error(productOrError.value.message);
    }

    return productOrError.value;
  }
}
