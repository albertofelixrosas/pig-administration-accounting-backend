import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concepts')
export class Concept {
  @ApiProperty({
    description: 'ID único del concepto',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'concept_id' })
  conceptId: number;

  @ApiProperty({
    description: 'Nombre del concepto',
    example: 'Gastos de Oficina',
    maxLength: 255,
  })
  @Column()
  name: string;
}
