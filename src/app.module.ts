import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PembelianModule } from './pembelian/pembelian.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PembelianModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
