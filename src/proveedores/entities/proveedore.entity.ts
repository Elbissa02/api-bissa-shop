import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Proveedore {
    @PrimaryColumn('text')
    DNI: string;

    @Column('text')
    nombre: string;

    @Column('text')
    direccion: string;

    @Column('text')
    telefono: string;

    @OneToMany(
        () => Producto,
        (producto) => producto.proveedore,
        {onDelete: "CASCADE", eager: true}
    )
    productos?: Producto[];
}
