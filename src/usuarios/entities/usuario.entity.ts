import { Cliente } from "src/clientes/entities/cliente.entity";
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Usuario {
    // @PrimaryColumn()
    // codigo: string;

    @PrimaryGeneratedColumn('increment')
    codigo: number;

    @Column('text')
    nombre: string;

    @Column('text')
    password?: string;
    
    @Column('text')
    website: string;

    @Column('text')
    email: string;

    @Column('text')
    twitter: string;

    @OneToOne(
        () => Cliente,
        (cliente) => cliente.usuario,
        {onDelete: "CASCADE"}
    )
    cliente?: Cliente;
    isActive: any;

}
