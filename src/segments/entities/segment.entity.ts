import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn({ name: 'segment_id' })
  segmentId: number;

  @Column()
  code: string;

  @Column()
  name: string;

  // Relación inversa con Movement
  @OneToMany(() => Movement, (movement) => movement.segment)
  movements: Movement[];
}
