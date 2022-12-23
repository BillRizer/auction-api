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
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: false })
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

  constructor(bid?: Partial<Bid>) {
    this.id = bid?.id;
    this.value = bid?.value;
    this.createdAt = bid?.createdAt;
    this.updatedAt = bid?.updatedAt;
    this.deletedAt = bid?.deletedAt;
  }
}
