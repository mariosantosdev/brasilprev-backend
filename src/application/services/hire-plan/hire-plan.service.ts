import { PlanEntity } from '@/application/entities/plan.entity';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { ClientRepository } from '@/application/repositories/client.repository';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { ProductRepository } from '@/application/repositories/product.repository';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { Injectable } from '@nestjs/common';

interface RequestParams {
  clientId: string;
  productId: string;
  contribution: number;
  hiredAt: Date;
  ageForRetirement: number;
}

@Injectable()
export class HirePlanService {
  constructor(
    private planRepository: PlanRepository,
    private productRepository: ProductRepository,
    private clientRepository: ClientRepository,
  ) {}

  async execute({
    clientId,
    productId,
    contribution,
    ...data
  }: RequestParams): Promise<Either<DomainException, PlanEntity>> {
    const client = await this.clientRepository.findById(clientId);

    if (!client)
      return left(new ResourceNotFoundException('Client not found.'));

    const product = await this.productRepository.findById(productId);

    if (!product)
      return left(new ResourceNotFoundException('Product not found.'));

    const planAlreadyHired =
      await this.planRepository.findByProductIdAndClientId(productId, clientId);

    if (planAlreadyHired)
      return left(new ConflictResourceException('Plan already hired.'));

    const planOrError = PlanEntity.create({
      client,
      clientId,
      product,
      productId,
      firstContribution: contribution,
      ...data,
    });

    if (planOrError.isLeft()) return left(planOrError.value);

    await this.planRepository.create(planOrError.value);

    return right(planOrError.value);
  }
}
