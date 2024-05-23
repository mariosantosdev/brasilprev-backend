import { Test, TestingModule } from '@nestjs/testing';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from '@/services/hello-world/hello-world.service';

describe('HelloWorldController', () => {
  let helloworldController: HelloWorldController;

  beforeEach(async () => {
    const helloworld: TestingModule = await Test.createTestingModule({
      controllers: [HelloWorldController],
      providers: [HelloWorldService],
    }).compile();

    helloworldController =
      helloworld.get<HelloWorldController>(HelloWorldController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(helloworldController.getHello()).toBe('Hello World!');
    });
  });
});
