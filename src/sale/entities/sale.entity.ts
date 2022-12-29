import { IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('decimal', { precision: 11, scale: 2, nullable: false })
  public value: number;

  @IsUUID()
  @Column({ nullable: false, name: 'user_id' })
  public userId: string;

  @IsUUID()
  @Column({ nullable: false, name: 'product_id' })
  public productId: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: string;

  constructor(sale?: Partial<Sale>) {
    this.id = sale?.id;
    this.value = sale?.value;
    this.createdAt = sale?.createdAt;
    this.updatedAt = sale?.updatedAt;
    this.deletedAt = sale?.deletedAt;
  }
}
