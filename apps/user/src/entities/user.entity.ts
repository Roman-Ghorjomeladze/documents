import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  firstName: string;

  @Column({ type: 'varchar', length: 60 })
  lastName: string;

  @Column({ type: 'varchar', length: 60 })
  email: string;

  @Column({ type: 'varchar', length: 60, select: false })
  password: string;

  @Column({ type: 'varchar', length: 25 })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
