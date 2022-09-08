import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("MqttModel")
export class MqttModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    total: number;
    
    @Column({nullable: true})
    success: number;

    @Column({nullable: true})
    failed: number;
}