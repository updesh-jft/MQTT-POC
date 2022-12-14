import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("JsonDataModel")
export class JsonDataModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: 'longtext'})
    jsonData: string;
}