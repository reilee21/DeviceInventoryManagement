import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Brand, Category } from '../../catalog/entities/catalog.entities';

@Entity('product_models')
export class ProductModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => Brand, { eager: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;


  @Column('jsonb', { nullable: true })
  specs: any;

  @Column({ length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
