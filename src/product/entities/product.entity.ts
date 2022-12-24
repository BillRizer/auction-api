import { IsBoolean, IsDate, IsNumber } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @IsBoolean()
  @Column({ name: 'available_for_auction', default: false })
  public availableForAuction: boolean;

  @IsBoolean()
  @Column({ default: false })
  public sold: boolean;

  @IsDate()
  @Column({ name: 'ends_at', nullable: true })
  public endsAt: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: string;

  @ManyToOne(() => User, (product) => Product, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;
  //TODO verify if it is correct, force partial type

  constructor(product?: Partial<Product>) {
    this.id = product?.id;
    this.name = product?.name;
    this.description = product?.description;
    this.category = product?.category;
    this.availableForAuction = product?.availableForAuction;
    this.endsAt = product?.endsAt;
    this.sold = product?.sold;
    this.user = {
      id: product?.user.id,
    };
    this.createdAt = product?.createdAt;
    this.updatedAt = product?.updatedAt;
    this.deletedAt = product?.deletedAt;
  }
}
