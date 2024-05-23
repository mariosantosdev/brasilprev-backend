import { ProductEntity } from '@/application/entities/product.entity';
import { ProductRepository } from '@/application/repositories/product.repository';

export class InMemoryProductRepository extends ProductRepository {
  items: ProductEntity[] = [];

  async create(product: ProductEntity) {
    this.items.push(product);
    return product;
  }

  async findById(id: string) {
    return this.items.find((product) => product.id === id);
  }

  async findBySusep(susep: string) {
    return this.items.find((product) => product.susep === susep);
  }

  async update(product: ProductEntity) {
    const index = this.items.findIndex((c) => c.id === product.id);
    this.items[index] = product;
    return product;
  }
}
