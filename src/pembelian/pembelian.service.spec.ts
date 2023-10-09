import { Test, TestingModule } from '@nestjs/testing';
import { pembelianService } from './pembelian.service';

describe('pembelianService', () => {
  let service: pembelianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [pembelianService],
    }).compile();

    service = module.get<pembelianService>(pembelianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
