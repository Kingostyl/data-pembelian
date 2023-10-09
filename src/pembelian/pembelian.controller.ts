/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { pembelianService } from './pembelian.service';
import {
  CreatePembelianDto,
  FilerPembelianDto,
  UpdatePembelianDto,
  createPembelianArrayDto,
  deletePembelianArrayDto,
} from './pembelian.dto';

@Controller('pembelian')
export class PembelianController {
  constructor(private pembelianService: pembelianService) {}

  @Get('list')
  getAllpembelian(@Query() filterpembelian: FilerPembelianDto) {
    return this.pembelianService.getAllPembelian(filterpembelian);
  }

  @Post('create')
  createpembelian(@Body() payload: CreatePembelianDto) {
    return this.pembelianService.createpembelian(payload);
  }

  @Put('update/:id')
  findOnepembelian(
    @Param('id') id: string,
    @Body() payload: UpdatePembelianDto,
  ) {
    return this.pembelianService.updatepembelian(Number(id), payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.pembelianService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.pembelianService.deletepembelian(+id);
  }

  @Post('create/bulk')
  createbulk(@Body() payload: createPembelianArrayDto) {
    console.log('pay', payload);
    return this.pembelianService.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deletebulk(@Body() id: deletePembelianArrayDto) {
    return this.pembelianService.bulkHapus(id);
  }
}
