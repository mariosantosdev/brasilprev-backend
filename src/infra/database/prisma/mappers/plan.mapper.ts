import { ClientEntity } from '@/application/entities/client.entity';
import { PlanEntity } from '@/application/entities/plan.entity';
import { ProductEntity } from '@/application/entities/product.entity';
import { Prisma, Plan, Product, Client } from '@prisma/client';

type PlanWithProductAndClient = Plan & {
  product: Product;
  client: Client;
};

export class PlanMapper {
  static toPrisma(raw: PlanEntity): Prisma.PlanUncheckedCreateInput {
    return {
      id: raw.id,
      ageForRetirement: raw.ageForRetirement,
      balance: raw.balance,
      clientId: raw.clientId,
      firstContribution: raw.firstContribution,
      hiredAt: raw.hiredAt,
      lastWithdrawalAt: raw.lastWithdrawal,
      productId: raw.productId,
    };
  }

  static toDomain(raw: PlanWithProductAndClient): PlanEntity {
    const productOrError = ProductEntity.create(raw.product, raw.productId);

    if (productOrError.isLeft()) {
      throw new Error(productOrError.value.message);
    }

    const clientOrError = ClientEntity.create(raw.client, raw.clientId);

    if (clientOrError.isLeft()) {
      throw new Error(clientOrError.value.message);
    }

    const planOrError = PlanEntity.create(
      {
        ...raw,
        product: productOrError.value,
        client: clientOrError.value,
      },
      raw.id,
    );

    if (planOrError.isLeft()) {
      throw new Error(planOrError.value.message);
    }

    return planOrError.value;
  }
}
