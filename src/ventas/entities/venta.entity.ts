import { Cliente } from "src/clientes/entities/cliente.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class Venta {
    @PrimaryColumn('text')
    ID: string;

    @Column('text')
    fecha: string;

    @Column('text')
    precio: string;

    @ManyToOne(
        () => Cliente,
        (cliente) => cliente.ventas,
        {onDelete: "CASCADE"}
    )
    cliente?: Cliente;

    @OneToMany(
        () => Producto,
        (producto) => producto.ventas,
        {onDelete: "CASCADE"}
    )
    producto?: Producto[];
}
