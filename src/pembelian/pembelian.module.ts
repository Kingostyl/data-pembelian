import { Module } from '@nestjs/common';
import { pembelianService } from './pembelian.service';
import { PembelianController } from './pembelian.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pembelian } from './pembelian.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pembelian])],
  providers: [pembelianService],
  controllers: [PembelianController],
})
export class PembelianModule {}
