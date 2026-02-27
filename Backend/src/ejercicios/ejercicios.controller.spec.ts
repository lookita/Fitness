import { Test, TestingModule } from '@nestjs/testing';
import { EjerciciosController } from './ejercicios.controller';

describe('EjerciciosController', () => {
  let controller: EjerciciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EjerciciosController],
    }).compile();

    controller = module.get<EjerciciosController>(EjerciciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
