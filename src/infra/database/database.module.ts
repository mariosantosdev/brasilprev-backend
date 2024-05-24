import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientRepository } from '@/application/repositories/client.repository';
import { PrismaClientRepository } from './prisma/repositories/client.repository';
import { ProductRepository } from '@/application/repositories/product.repository';
import { PrismaProductRepository } from './prisma/repositories/product.repository';
import { PlanRepository } from '@/application/repositories/plan.repository';
import { PrismaPlanRepository } from './prisma/repositories/plan.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: ClientRepository,
      useClass: PrismaClientRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: PlanRepository,
      useClass: PrismaPlanRepository,
    },
  ],
  exports: [PrismaService, ClientRepository, ProductRepository, PlanRepository],
})
export class DatabaseModule {}
