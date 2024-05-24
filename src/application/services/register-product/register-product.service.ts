import { ProductEntity } from '@/application/entities/product.entity';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';
import { ProductRepository } from '@/application/repositories/product.repository';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { Injectable } from '@nestjs/common';

interface RequestParams {
  name: string;
  susep: string;
  endDateToHire: Date;
  minFirstContribution: number;
  minExtraContribution: number;
  minAgeForContract: number;
  minAgeForBenefit: number;
  firstWithdrawalPeriod: number;
  withdrawalPeriod: number;
}

@Injectable()
export class RegisterProductService {
  constructor(private repository: ProductRepository) {}

  async execute(
    data: RequestParams,
  ): Promise<Either<DomainException, ProductEntity>> {
    const susepAlreadyExists = await this.repository.findBySusep(data.susep);

    if (susepAlreadyExists) {
      return left(new ConflictResourceException('Susep already exists'));
    }

    const productOrError = ProductEntity.create(data);

    if (productOrError.isLeft()) return;

    await this.repository.create(productOrError.value);

    return right(productOrError.value);
  }
}
