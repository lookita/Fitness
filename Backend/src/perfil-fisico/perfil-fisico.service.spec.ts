import { Test, TestingModule } from '@nestjs/testing';
import { PerfilFisicoService } from './perfil-fisico.service';

describe('PerfilFisicoService', () => {
  let service: PerfilFisicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilFisicoService],
    }).compile();

    service = module.get<PerfilFisicoService>(PerfilFisicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
