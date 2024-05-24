import { PlanEntity } from '@/application/entities/plan.entity';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlanMapper } from '../mappers/plan.mapper';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private prisma: PrismaService) {}

  async findByIdAndClientId(id: string, clientId: string): Promise<PlanEntity> {
    const plan = await this.prisma.plan.findFirst({
      where: {
        OR: [{ id }, { clientId }],
      },
      include: { client: true, product: true },
    });

    if (!plan) return null;

    return PlanMapper.toDomain(plan);
  }

  async findByProductIdAndClientId(
    productId: string,
    clientId: string,
  ): Promise<PlanEntity> {
    const plan = await this.prisma.plan.findFirst({
      where: {
        AND: [{ productId }, { clientId }],
      },
      include: { client: true, product: true },
    });

    if (!plan) return null;

    return PlanMapper.toDomain(plan);
  }

  async create(entity: PlanEntity): Promise<PlanEntity> {
    const data = PlanMapper.toPrisma(entity);

    await this.prisma.plan.create({ data });

    return entity;
  }

  async update(entity: PlanEntity): Promise<PlanEntity> {
    const data = PlanMapper.toPrisma(entity);

    await this.prisma.plan.update({ data, where: { id: entity.id } });

    return entity;
  }

  async findById(id: string): Promise<PlanEntity> {
    const plan = await this.prisma.plan.findFirst({
      where: { id },
      include: { client: true, product: true },
    });

    if (!plan) return null;

    return PlanMapper.toDomain(plan);
  }
}
