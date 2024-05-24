import { ProductEntity } from '@/application/entities/product.entity';
import { ProductRepository } from '@/application/repositories/product.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findBySusep(susep: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findFirst({ where: { susep } });

    if (!product) return null;

    return ProductMapper.toDomain(product);
  }

  async create(entity: ProductEntity): Promise<ProductEntity> {
    const data = ProductMapper.toPrisma(entity);

    await this.prisma.product.create({ data });

    return entity;
  }

  async update(entity: ProductEntity): Promise<ProductEntity> {
    const data = ProductMapper.toPrisma(entity);

    await this.prisma.product.update({ data, where: { id: entity.id } });

    return entity;
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findFirst({ where: { id } });

    if (!product) return null;

    return ProductMapper.toDomain(product);
  }
}
