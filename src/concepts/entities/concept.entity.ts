import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concepts')
export class Concept {
  @PrimaryGeneratedColumn({ name: 'concept_id' })
  conceptId: number;

  @Column()
  name: string;
}
