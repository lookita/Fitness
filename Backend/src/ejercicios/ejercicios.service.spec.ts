import { Test, TestingModule } from '@nestjs/testing';
import { EjerciciosService } from './ejercicios.service';

describe('EjerciciosService', () => {
  let service: EjerciciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EjerciciosService],
    }).compile();

    service = module.get<EjerciciosService>(EjerciciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
