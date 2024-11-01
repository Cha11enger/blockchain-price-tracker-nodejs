import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chain: string;

    @Column('float')
    targetPrice: number;

    @Column()
    email: string;

    @CreateDateColumn()
    createdAt: Date;
}
