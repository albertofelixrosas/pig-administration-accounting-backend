import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('segments')
export class Segment {
  @ApiProperty({
    description: 'ID único del segmento',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'segment_id' })
  segmentId: number;

  @ApiProperty({
    description: 'Código único del segmento',
    example: 'SEG-001',
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo del segmento',
    example: 'Segmento de Ventas',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Movimientos asociados al segmento',
    type: () => [Movement],
  })
  // Relación inversa con Movement
  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];
}
