import { Test, TestingModule } from '@nestjs/testing';
import { RegisterClientService } from './register-client.service';
import { ClientRepository } from '@/application/repositories/client.repository';
import { InMemoryClientRepository } from '@root/test/repositories/in-memory-client.repository';
import { ClientEntity } from '@/application/entities/client.entity';
import { makeClientFactory } from '@root/test/factories/make-client.factory';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';

describe('RegisterClientService', () => {
  let service: RegisterClientService;
  let repository: InMemoryClientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterClientService,
        {
          provide: ClientRepository,
          useClass: InMemoryClientRepository,
        },
      ],
    }).compile();

    service = module.get(RegisterClientService);
    repository = module.get(ClientRepository);
  });

  it('should register a client', async () => {
    const client = makeClientFactory();

    expect(repository.items).toHaveLength(0);

    const result = await service.execute(client);

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ClientEntity);

    expect(repository.items).toHaveLength(1);
  });

  it('should not register a client twice', async () => {
    const client = makeClientFactory();

    await repository.create(client);

    expect(repository.items).toHaveLength(1);

    const result = await service.execute(client);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ConflictResourceException);

    expect(repository.items).toHaveLength(1);
  });
});
