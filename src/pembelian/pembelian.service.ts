import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import {
  CreatePembelianDto,
  UpdatePembelianDto,
  createPembelianArrayDto,
  deletePembelianArrayDto,
  FilerPembelianDto,
} from './pembelian.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pembelian } from './pembelian.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class pembelianService {
  constructor(
    @InjectRepository(Pembelian)
    private readonly pembelianRepository: Repository<Pembelian>,
  ) {}

  private pembelians: {
    id: number;
    nama: string;
    merek_mobil: string;
    tipe_mobil: string;
    harga: number;
    tahun: number;
  }[] = [
    {
      id: 1,
      nama: 'ariiq',
      merek_mobil: 'toyota',
      tipe_mobil: 'CRV',
      harga: 150000000,
      tahun: 2018,
    },
  ];

  async getAllPembelian(
    filerpembelianDto: FilerPembelianDto,
  ): Promise<ResponsePagination> {
    const { page, pageSize, nama, merek_mobil, tipe_mobil, harga, tahun } =
      filerpembelianDto;

    const myfilter: {
      [key: string]: any;
    } = {};

    if (nama) {
      myfilter.nama = Like(`%${nama}%`);
    }
    if (merek_mobil && ['toyota', 'honda', 'suzuki'].includes(merek_mobil)) {
      myfilter.merek_mobil = Like(`%${merek_mobil}%`);
    }
    if (tipe_mobil) {
      myfilter.tipe_mobil = Like(`%${tipe_mobil}%`);
    }
    if (harga) {
      myfilter.harga = Like(`%${harga}%`);
    }
    if (tahun) {
      myfilter.tahun = Like(`%${tahun}%`);
    }

    const total = await this.pembelianRepository.count({
      where: myfilter,
    });
    const hasil = await this.pembelianRepository.find({
      where: myfilter,
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    return {
      status: 'Success',
      message: 'List pembelian ditemukan',
      data: hasil,
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
        total_page: Math.ceil(total / pageSize),
      },
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const pembelian = await this.pembelianRepository.findOne({
      where: {
        id: id,
      },
    });

    if (pembelian === null) {
      throw new NotFoundException(`pembelian dengan id ${id} tidak di temukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: pembelian,
    };
  }

  async createpembelian(payload: CreatePembelianDto): Promise<ResponseSuccess> {
    try {
      const { nama, merek_mobil, tipe_mobil, harga, tahun } = payload;
      const pembelianSave = await this.pembelianRepository.save({
        nama: nama,
        merek_mobil: merek_mobil,
        tipe_mobil: tipe_mobil,
        harga: harga,
        tahun: tahun,
      });

      return {
        status: 'Success',
        message: 'Berhasil menambakan pembelian',
        data: pembelianSave,
      };
    } catch {
      throw new HttpException('Wrong Error', HttpStatus.BAD_REQUEST);
    }
  }

  async updatepembelian(
    id: number,
    payload: UpdatePembelianDto,
  ): Promise<ResponseSuccess> {
    const pembelian = await this.pembelianRepository.findOne({
      where: {
        id: id,
      },
    });

    if (pembelian === null) {
      throw new NotFoundException(`pembelian dengan id ${id} tidak di temukan`);
    }
    const update = await this.pembelianRepository.save({ ...payload, id: id });
    return {
      status: 'ok',
      message: 'Berhasil memperbaharui pembelian',
      data: update,
    };
  }

  async deletepembelian(id: number): Promise<ResponseSuccess> {
    const delet = await this.pembelianRepository.findOne({
      where: {
        id: id,
      },
    });

    if (delet === null) {
      throw new NotFoundException(`pembelian dengan id ${id} tidak di temukan`);
    }
    const hapus = await this.pembelianRepository.delete(id);
    return {
      status: 'ok',
      message: 'Berhasil Menghapus pembelian',
      data: hapus,
    };
  }

  private findpembelianById(id: number) {
    const pembelianIndex = this.pembelians.findIndex(
      (pembelian) => pembelian.id === id,
    );

    if (pembelianIndex === -1) {
      throw new NotFoundException(`pml dengan ${id} tidak di temukan`);
    }

    return pembelianIndex;
  }

  async bulkCreate(payload: createPembelianArrayDto): Promise<ResponseSuccess> {
    console.log('pay', payload);
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.pembelianRepository.save(item);

            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menyimpan pembelian ${berhasil} dan gagal ${gagal}`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkHapus(check: deletePembelianArrayDto): Promise<ResponseSuccess> {
    console.log('pay', check);
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        check.delete.map(async (id) => {
          try {
            const del = await this.pembelianRepository.delete(id);

            if (del.affected === 1) {
              berhasil = berhasil + 1;
            } else {
              gagal = gagal + 1;
            }
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menghapus pembelian ${berhasil} dan gagal ${gagal}`,
        data: check,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
