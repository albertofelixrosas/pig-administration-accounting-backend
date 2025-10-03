import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateAccountingAccountDto {
  @ApiProperty({
    description:
      'Código único de la cuenta contable (formato: XXX-XXX-XXX-XXX-XX)',
    example: '101-001-001-001-01',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^\d{3}-\d{3}-\d{3}-\d{3}-\d{2}$/, {
    message:
      'El código de cuenta debe tener el formato XXX-XXX-XXX-XXX-XX (ejemplo: 101-001-001-001-01)',
  })
  accountCode: string;

  @ApiProperty({
    description: 'Nombre descriptivo de la cuenta contable',
    example: 'Caja General',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
