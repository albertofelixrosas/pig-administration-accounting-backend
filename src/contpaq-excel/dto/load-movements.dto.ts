import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoadMovementsDto {
  @ApiProperty({
    description: 'Ruta absoluta del archivo Excel con datos de ContPAQ',
    example: './uploads/1234567890-contpaq-data.xlsx',
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;
}
