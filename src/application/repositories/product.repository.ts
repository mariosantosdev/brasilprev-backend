import { BaseRepository } from '@/commons/interfaces/base.repository';
import { ProductEntity } from '../entities/product.entity';

export abstract class ProductRepository extends BaseRepository<ProductEntity> {
  abstract findBySusep(susep: string): Promise<ProductEntity | undefined>;
}
