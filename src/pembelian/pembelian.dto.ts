import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Max,
  Min,
  ValidateNested,
  IsArray,
  IsIn,
  IsOptional,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class PembelianDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  @IsIn(['honda', 'toyota', 'suzuki'], {
    message: 'Merek mobil harus salah satu dari: honda, toyota, suzuki',
  })
  merek_mobil: string;

  @IsNotEmpty()
  @IsIn(
    [
      'CRV',
      'BRV',
      'HRV',
      'Avanza',
      'Innova',
      'Raize',
      'Ertiga',
      'XL7',
      'Baleno',
    ],
    {
      message: 'Tipe mobil tidak valid',
    },
  )
  tipe_mobil: string;

  @IsNotEmpty()
  @Min(150000000)
  @Max(400000000)
  harga: number;

  @IsInt()
  @Min(2017)
  @Max(2023)
  tahun: number;
}

export class CreatePembelianDto extends OmitType(PembelianDto, ['id']) {}
export class UpdatePembelianDto extends PickType(PembelianDto, [
  'nama',
  'merek_mobil',
  'tipe_mobil',
  'harga',
  'tahun',
]) {}

export class createPembelianArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreatePembelianDto)
  data: CreatePembelianDto[];
}

export class deletePembelianArrayDto {
  @IsArray()
  delete: number[];
}

@ValidatorConstraint({ name: 'mobile', async: false })
export class IsTipeMobilValid implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { object } = args;
    if (!object) {
      return false;
    }
    const allowedTypes: { [merek: string]: string[] } = {
      honda: ['CRV', 'BRV', 'HRV'],
      toyota: ['Avanza', 'Innova', 'Raize'],
      suzuki: ['Ertiga', 'XL7', 'Baleno'],
    };

    const merekMobil = object['merek_mobil'];
    if (merekMobil in allowedTypes) {
      return allowedTypes[merekMobil].includes(value);
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Tipe mobil tidak valid untuk merek mobil '${args.object['merek_mobil']}'`;
  }
}

export class FilerPembelianDto extends PageRequestDto {
  @IsOptional()
  nama: string;

  @IsOptional()
  merek_mobil: string;

  @IsOptional()
  tipe_mobil: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  harga: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tahun: number;
}
