import { Test, TestingModule } from '@nestjs/testing';
import { RegisterProductService } from './register-product.service';
import { ProductRepository } from '@/application/repositories/product.repository';
import { InMemoryProductRepository } from '@root/test/repositories/in-memory-product.repository';
import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { ProductEntity } from '@/application/entities/product.entity';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';

describe('RegisterProductService', () => {
  let service: RegisterProductService;
  let repository: InMemoryProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterProductService,
        {
          provide: ProductRepository,
          useClass: InMemoryProductRepository,
        },
      ],
    }).compile();

    service = module.get(RegisterProductService);
    repository = module.get(ProductRepository);
  });

  it('should register a product', async () => {
    const product = makeProductFactory();

    expect(repository.items).toHaveLength(0);

    const result = await service.execute(product);

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ProductEntity);

    expect(repository.items).toHaveLength(1);
  });

  it('should not register a product with same susep', async () => {
    const firstProduct = makeProductFactory();

    await repository.create(firstProduct);

    const secondaryProduct = makeProductFactory({ susep: firstProduct.susep });

    expect(repository.items).toHaveLength(1);

    const result = await service.execute(secondaryProduct);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ConflictResourceException);

    expect(repository.items).toHaveLength(1);
  });
});
