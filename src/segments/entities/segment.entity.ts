import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn({ name: 'segment_id' })
  segmentId: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
