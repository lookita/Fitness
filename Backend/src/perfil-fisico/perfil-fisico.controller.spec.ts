import { Test, TestingModule } from '@nestjs/testing';
import { PerfilFisicoController } from './perfil-fisico.controller';

describe('PerfilFisicoController', () => {
  let controller: PerfilFisicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilFisicoController],
    }).compile();

    controller = module.get<PerfilFisicoController>(PerfilFisicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
